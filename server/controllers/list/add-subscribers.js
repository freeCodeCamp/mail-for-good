const SubscriberModel = require('../../models').subscriber;

module.exports = function(req, res) {
    const subscribers = req.body.subscribers;
    const fields = req.body.fields;

    subscribers.forEach(subscriber => {
        SubscriberModel.findOne({
            where: {
                email:subscriber.email
            }
        }).then(email => {
            if (email) {
                res.status(400)
                    .send({
                  status: 'error', // Redundant
                  message:'This email already exists'
                });
            } else {
                SubscriberModel.create({
                    email: subscriber.email
                }).then(() => {
                    res.status(201)
                        .send({
                      status: 'success', // Redundant
                      message: `${subscriber.email} added succesfully`
                    });
                });
            }
        })
    });
}
