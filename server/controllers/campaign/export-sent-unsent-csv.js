const Campaign = require('../../models').campaign;
const CampaignSubscriber = require('../../models').campaignsubscriber;

module.exports = (req, res) => {
  const userId = req.user.id;
  const campaignId = req.query.campaignId;
  const sent = req.query.sent;   // TODO: improve validation - should be false or true

  Campaign.findOne({
    where: {
      userId,
      id: campaignId
    },
    attributes: ['id'],
    raw: true
  }).then(list => {
    if (!list) {
      res.status(401)  //??
        .send({
          message: 'not authorised to view campaign or campaign does not exist'
        });
    } else {
      // Request headers
      res.setHeader('Content-disposition', 'attachment; filename=subscribers.csv');
      res.setHeader('Content-type', 'text/csv');

      // CSV file header row
      res.write('email\n');

      // Construct filter query
      let where = { sent, campaignId };
      if (sent === 'true') {
        where.sent = true;
      } else if (sent === 'false') {
        where.sent = false;
      }

      sendSubscribers();

      function sendSubscribers(offset=0, limit=10000) {  // limit is how many rows to hold in memory
        CampaignSubscriber.findAll({
          where,
          offset,
          limit,
          attributes: ['email'],
          raw: true
        }).then(listSubscribers => {
          if (listSubscribers.length) {
            let chunk = '';

            // Build csv rows from the data
            listSubscribers.forEach(listSubscriber => {
              chunk += `${listSubscriber.email}\n`;
            });

            // Make sure that the response buffer is empty before fetching and sending more
            // rows. Otherwise we will run out of memory by filling up the buffer
            if (res.write(chunk)) {
              sendSubscribers(offset + limit);
            } else {
              res.once('drain', () => {
                sendSubscribers(offset + limit);
              })
            }
          } else {
            res.end();
            return;
          }
        })
      }
    }
  });
};
