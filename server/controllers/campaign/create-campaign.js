const db = require('../../models');

module.exports = (req, res) => {
  /*
        Outstanding issues:
        -- Validate other things? Validations can be added as promises to validationComplete and run concurrently
  */

  // Will mutate the below object to extract info we need during validation checks
  const valuedFromValidation = {};

  // Validate that this list belongs to the user
  const validateListBelongsToUser = db.list.findOne({
    where: {
      name: req.body.listName, // Could use list ID here
      userId: req.user.id
    }
  }).then(instance => { // The requested list exists & it belongs to the user
    if (instance) {
      valuedFromValidation.listId = instance.dataValues.id;
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
      // Find or create the campaign
      db.campaign.findOrCreate({
        where: {
          name: req.body.campaignName, // Campaign exists & belongs to user
          userId: req.user.id
        },
        defaults: {
          name: req.body.campaignName, // Repeating these fields to make it clear that this property marks the new row's fields
          userId: req.user.id,
          listId: valuedFromValidation.listId
        }
      }).then((instance) => {
        if (instance[0].$options.isNewRecord) {
          res.status(200).send({message: 'New campaign successfully created'});
        } else {
          res.status(400).send(); // As before, form will be validated client side so no need for a response
        }
      }, err => {
        throw err;
      });
    }
  });
}
