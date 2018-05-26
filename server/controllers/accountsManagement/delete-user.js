const db = require('../../models');


module.exports = function(req, res) {
  Promise.all([
    db.user.getIsAdmin(req.body.queriersEmail),
    db.user.checkIfUserExists(req.body.email)
  ]).then((checks) => {
    if(checks[0] === false){
      res.status(403).send('You don\'t have the rights to delete this user.')
    }else if(checks[1] === false){
      res.status(409).send('The account you are trying to delete doesn\t exist.')
    }else{
      db.user.destroy({where:{email:req.body.email}})
      .catch((error,errorStatus) => {res.status(500).send('The application has\'nt been able to delete the user.')})
      .then(success => {res.status(200).send('User successfully deleted.')})
    }
    return null
  }).catch(error => {
    console.log(error);
    res.status(500).send(error.message);
  })
}
