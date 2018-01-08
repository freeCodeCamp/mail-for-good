const ListSubscriber = require('../../models').listsubscriber;
const List = require('../../models').list;

module.exports = function(req, res) {
  const email = req.query.email;
  const subscribeKey = req.query.subscribeKey;
  const redirectOnSuccess = req.query.redirectOnSuccess;
  const redirectOnFailure = req.query.redirectOnFailure;

  List.findOne({
    where: { subscribeKey }
  }).catch(error => {
    console.error(error);
  }).then(list => {
    if (list) {
      const listId = list.dataValues.id;

      ListSubscriber.findOne({
        where: {
          listId,
          email
        },
        plain: true
      }).then(listSubscriber => {
        if (listSubscriber) {
          ListSubscriber.update(
            { subscribed: true },
            { where: { id: listSubscriber.id } }
          ).then(handleSuccess(res,redirectOnSuccess));
        } else {
          ListSubscriber.create({
            email, listId
          }).then(handleSuccess(res,redirectOnSuccess));
        }
      });
    } else {
      handleFailure(res,redirectOnFailure);
    }
  });
};

function handleSuccess(res,redirectOnSuccess){
  if(redirectOnSuccess!==''){
    res.redirect(redirectOnSuccess);
  }else{
    res.status(201).send({
        status: 'success', // Redundant
        message: `added successfully`
    });
  }
}

function handleFailure(res,redirectOnFailure){
  if(redirectOnFailure!==''){
    res.redirect(redirectOnFailure);
  }else{
    res.status(400).send('invalid list subscriber key');
  }
}
