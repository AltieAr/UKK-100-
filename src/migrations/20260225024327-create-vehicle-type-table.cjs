'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('vehicle_types', {
      id_type: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      vehicle_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      
    });
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.dropTable('vehicle_types');
   
  }
};
