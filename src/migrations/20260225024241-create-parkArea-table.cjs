'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('parkArea', {
      id_area: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      area_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      filled: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },

  async down (queryInterface, Sequelize) {
  
      await queryInterface.dropTable('parkArea');
     
  }
};
