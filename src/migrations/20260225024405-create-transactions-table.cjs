'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id_transaction: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      id_vehicle: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'id_vehicle'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      id_area: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'parkArea',
          key: 'id_area'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id_user'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      id_fees: {
        type: Sequelize.INTEGER,
        references: {
          model: 'fees',
          key: 'id_fees'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      check_in: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      check_out: {
        type: Sequelize.DATE
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total: {
        type: Sequelize.DECIMAL(10, 0),
        defaultValue: 0
      },
      // Ganti array ['masuk', 'keluar'] sesuai nilai aslinya
      status: {
        type: Sequelize.ENUM('masuk', 'keluar'), 
        defaultValue: 'masuk'
      }
    });
  },

  async down (queryInterface, Sequelize) {
  
     await queryInterface.dropTable('transactions');
     
  }
};
