'use strict'


module.exports =  function(req, res) {
  const subscribers = req.body.subscribers;
  const fields = req.body.fields;
  
  console.log("got new subscribers: ");
  console.log(subscribers);
  console.log(fields);
  // -> use schema + add all the subscribers + field types to the database
}
