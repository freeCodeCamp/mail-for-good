'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'password',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'users',
        'isAdmin',
        Sequelize.BOOLEAN
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeColumn(
        'users',
        'password',
        Sequelize.STRING
      ),
      queryInterface.removeColumn(
        'users',
        'isAdmin',
        Sequelize.BOOLEAN
      )
    ])
  }
};
