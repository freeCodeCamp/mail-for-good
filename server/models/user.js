'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    googleId: DataTypes.STRING,
    picture: DataTypes.STRING,
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    sentEmailsCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },

      //check the .env to check if the user behind the given mail has the privilege to log in
      isWhiteListed: function (emails) {
        //the white listed emails are stored in the .env file as a string
        //example : 'ernest@hemingway.com,ada@lovelace.com,george@orwell.com'

        //array-ify the environemental variable
        const whiteListedEmails = process.env.WHITELISTEDEMAILS.split(',');

        //emails is an array of objects like [{value:'jon@doe.com',type:'account'}]
        //here we only keep the mails and put them in an array
        const clientsMails = emails.map((mail)=>{
          return mail.value;
        });

        //here we create an array containing the intersection of the white listed email and the provided emails
        const intersection =  clientsMails.filter((mail)=>{
          return whiteListedEmails.indexOf(mail) !== -1;
        });

        //if the intersection is empty the user isn't white listed
        return intersection.length !== 0;
      }
    }
  });
  return user;
};
