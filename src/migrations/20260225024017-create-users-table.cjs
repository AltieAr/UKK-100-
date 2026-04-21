'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id_user: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      NPWP: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true
      },
      full_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email:{
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      phone_number:{
        type: Sequelize.STRING(13),
        allowNull: true,
        unique: true
      },
      role: {
        type: Sequelize.ENUM('admin', 'operator','owner'), 
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.dropTable('users');
     
  }
};
