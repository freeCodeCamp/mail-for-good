'use strict';
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    googleId: DataTypes.STRING,
    picture: DataTypes.STRING,
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    sentEmailsCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  User.addHook('afterSync',() => {
    User.findOne({where:{isAdmin:true}})
    .then((anAdmin)=>{
      if(anAdmin === null){
          User.createOne({
          email:'admin@admin.com',
          name:'admin',
          password:'admin',
          isAdmin:true
        })
      }
    })
    return null
  })

  //returns Promise(isValid:boolean)
  User.checkPassword = (plainTextPassword, hash) => {
    return bcrypt.compare(plainTextPassword, hash);
  }

  //returns Promise(hash:string)
  User.generateHash = (plainTextPassword) => {
    return bcrypt.hash(plainTextPassword, 12/*salt rounds*/);
  }

  User.getIsAdmin = (email) =>{
    return new Promise((resolve,reject)=>{
      User.findOne(
        {
          where:{
            email:email
          }
        }
      ).catch(error => {
        reject(new Error('Mail for Good couldn\'t access the database.'))
      }).then(user =>{
        resolve(user.isAdmin)
      })
    })
  }

  User.checkIfUserExists = (email) => {
    return new Promise((resolve, reject)=>{
      User.findOne(
        {
          where:{
            email:email
          }
        }
      ).catch(error =>{
        reject(new Error('Mail for Good couldn\'t access the database.'))
      }).then(user =>{
        if(user){
          resolve(true)
        }else{
          resolve(false)
        }
      })
    })
  }

  User.createOne = async (userObject) => {
    const hash = await User.generateHash(userObject.password)
    return User.create({
      email:userObject.email,
      name:userObject.email,
      password:hash,
      isAdmin:userObject.isAdmin,
    })
  }


  return User;
};
