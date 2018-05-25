const db = require('../../models');

module.exports = function(req, res) {
  Promise.all([
    db.user.getIsAdmin(req.body.data.queriersEmail),
    db.user.checkIfUserExists(req.body.data.email)
  ]).then((checks) => {
    if(checks[0] === false){
      res.status(403).send('You don\'t have the rights to create a user.')
    }else if(checks[1] === true){
      res.status(409).send('This user already exists.')
    }else{
      db.user.createOne(req.body.data)
        .catch((error,errorStatus) => {res.status(500).send('The application has\'nt been able to create the user.')})
        .then(success => {res.status(200).send('User successfully created.')})
    }
    return null
  }).catch(error => {
    console.log(error);
    res.status(500).send(error.message);
  })
}
