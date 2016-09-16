'use strict'


module.exports =  function(req, res) {
  const subscribers = req.body.data;
  const fields = req.body.fields;
  
  console.log("got new subscribers: ");
  console.log(subscribers);
  // -> use schema + add all the subscribers + field types to the database
}
