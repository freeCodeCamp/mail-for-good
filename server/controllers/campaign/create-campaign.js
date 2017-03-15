const db = require('../../models');
const slug = require('slug');

const sendSingleNotification = require('../websockets/send-single-notification');


module.exports = (req, res, io) => {
  /*
        Outstanding issues:
        -- Validate other things? Validations can be added as promises to validationComplete and run concurrently
        -- Clean up sequelize code
  */

  const userId = req.user.id;

  // Will mutate the below object to extract info we need during validation checks
  const valueFromValidation = {};

  // Validate that this list belongs to the user
  const validateListBelongsToUser = db.list.findOne({
    where: {
      name: req.body.listName, // Could use list ID here
      userId
    }
  }).then(instance => { // The requested list exists & it belongs to the user
    if (instance) {
      valueFromValidation.listId = instance.dataValues.id;
      return true;
    } else {
      return false;
    }
  }, err => {
    throw err;
  });

  Promise.all([validateListBelongsToUser]).then(values => {
    if (values.some(x => x === false)) {
      res.status(400).send(); // If any validation promise resolves to false, fail silently. No need to respond as validation is handled client side & this is a security measure.
    } else {

      const emailBodyType = req.body.emailBody;

      // Find or create the campaign
      db.campaign.findOrCreate({
        where: {
          name: req.body.campaignName, // Campaign exists & belongs to user
          userId: req.user.id
        },
        defaults: {
          name: req.body.campaignName, // Repeating these fields to make it clear that this property marks the new row's fields
          fromName: req.body.fromName,
          fromEmail: req.body.fromEmail,
          emailSubject: req.body.emailSubject,
          emailBody: emailBodyType,
          type: req.body.type,
          trackingPixelEnabled: req.body.trackingPixelEnabled,
          trackLinksEnabled: req.body.trackLinksEnabled,
          unsubscribeLinkEnabled: req.body.unsubscribeLinkEnabled,
          userId: req.user.id,
          listId: valueFromValidation.listId,
          slug: slug(req.body.campaignName)
        }
      }).then((instance) => {
        if (instance[0].$options.isNewRecord) {
          const campaignId = instance[0].dataValues.id;
          let totalCampaignSubscribersProcessed = 0;
          db.campaignanalytics.create({campaignId}).then(() => {
            // Iterate through blocks of 10k ListSubscribers and bulk create CampaignSubscribers.
            // Each time we write (bulk insert) 10k ListSubscribers, fetch the next 10k by recursively calling
            // createCampaignSubscribers - ensures that we don't run out of ram by loading too many ListSubscribers
            // at once.
            res.send({message: 'Campaign is being created - it will be ready to send soon.'}); // Should use notification/status rather than simple response
            function createCampaignSubscribers(offset = 0, limit = 10000) {
              db.listsubscriber.findAll({
                where: {
                  listId: valueFromValidation.listId
                },
                limit,
                offset,
                attributes: [
                  [
                    'id', 'listsubscriberId'
                  ],
                  'email'
                ], // Nested array used to rename id to listsubscriberId
                order: [
                  ['id', 'ASC']
                ],
                raw: true
              }).then(listSubscribers => {
                if (listSubscribers.length) { // If length is 0 then there are no more ListSubscribers, so we can cleanup
                  totalCampaignSubscribersProcessed += listSubscribers.length;
                  listSubscribers = listSubscribers.map(listSubscriber => {
                    listSubscriber.campaignId = campaignId;
                    return listSubscriber;
                  });
                  db.campaignsubscriber.bulkCreate(listSubscribers).then(() => {
                    createCampaignSubscribers(offset + limit);
                  });
                } else {
                  db.campaign.update({
                    status: 'ready',
                    totalCampaignSubscribers: totalCampaignSubscribersProcessed
                  }, {
                    where: {
                      id: campaignId
                    }
                  }).then(() => {
                    sendSuccessNotification();
                    return;
                  }).catch(err => {
                    throw err;
                  });
                }
              });
            }
            createCampaignSubscribers(); // Start creating CampaignSubscribers
          });
        } else {
          res.status(400).send(); // As before, form will be validated client side so no need for a response
        }
      }, err => {
        throw err;
      });
    }
  }).catch(err => {
    res.status(400).send(err);
  });

  function sendSuccessNotification() {
    const notification = {
      message: `${req.body.campaignName} is ready to send`,
      icon: 'fa-list-alt',
      iconColour: 'text-green',
      newDataToFetch: 'campaigns',  // A client side resource to be updated, e.g. 'campaigns'
      url: `/campaigns/manage/${slug(req.body.campaignName)}`  // User is redirected to this (relative) url when they dismiss a notification
    };

    sendSingleNotification(io, req, notification);
  }
};
