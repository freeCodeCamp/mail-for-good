const db = require('../../models');

module.exports = () => {
  const { sequelize } = db;

  sequelize.sync({force:false,hooks:true})
};
