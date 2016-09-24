'use strict'
const SubscriberModel = require('../db/models').Subscriber;

module.exports =  function(req, res) {
  const subscribers = req.body.subscribers;
  const fields = req.body.fields;

  console.log("got new subscribers: ");
  console.log(subscribers);
  console.log(fields);

  subscribers.forEach(subscriber => {

    SubscriberModel.find({email:subscriber.email}, (err, doc) => {
      if (err) throw err;
      if (doc) {
        // User exists! Do not save doc
        res.send({
          status: 'error',
          message:'This email already exists'
        });
      } else {
        let newSubscriber = new SubscriberModel();
        newSubscriber.email = subscriber.email;
        newSubscriber.save(err => {
          if (err) throw err;
        });
      }
    })
  });
  // -> use schema + add all the subscribers + field types to the database
}
