const list = require('../../models').list;
const listsubscriber = require('../../models').listsubscriber;

const listPermission = require('../permissions/acl-lib/acl-list-permissions');

module.exports = (req, res) => {
  // Find all subscribers belonging to a list
  const listId = req.query.listId;
  const offset = req.query.offset;
  const limit = req.query.limit;
  const filters = JSON.parse(req.query.filters) || {};
  let userId = '';

  const access = listPermission(req.cookies.user, req.user.id)
    .then(userIdAndLists => {
      // userIdAndCampaigns.lists must not equal 'None'
      if (userIdAndLists.lists === 'None') {
        throw 'Permission denied';
      } else {
        userId = userIdAndLists.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {

    list.findOne({
      where: {
        userId,
        id: listId
      },
      attributes: ['name', 'createdAt', 'updatedAt', 'additionalFields'],
      raw: true
    }).then(instancesArray => {
      const additionalFields = instancesArray.additionalFields;

      if (!instancesArray) {
        res.status(401)  //??
          .send({
            message: 'not authorised to view list or list does not exist'
          });
        return;
      } else {
        let where = { listId };
        if (filters.subscribed === 'true') {
          where.subscribed = true;
        } else if (filters.subscribed === 'false') {
          where.subscribed = false;
        }

        const statusFilters = ['bounce:permanent', 'bounce:transient', 'bounce:undetermined', 'complaint', 'unconfirmed'];
        if (statusFilters.includes(filters.mostRecentStatus)) {
          where.mostRecentStatus = filters.mostRecentStatus;
        }

        listsubscriber.findAll({
          where,
          offset: ( offset - 1) * limit,
          limit,
          order: [ ['id', 'ASC'] ],
          attributes: ['id', 'email', 'subscribed', 'createdAt', 'updatedAt', 'mostRecentStatus', 'additionalData'],
          raw: true
        }).then(instancesArray => {
          listsubscriber.count({
            where
          }).then(total => {
            res.send({ subscribers: instancesArray, total, additionalFields });
          });
        });
      }
    });
  });
};
