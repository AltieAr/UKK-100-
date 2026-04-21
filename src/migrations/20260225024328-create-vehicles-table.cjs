'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id_vehicle: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      plate_number: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
      },
      id_type: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vehicle_types',
          key: 'id_type'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'SET NULL'
      },
      color: {
        type: Sequelize.STRING(20)
      },
      // owner: {
      //   type: Sequelize.STRING(100)
      // },
      // id_user: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'users', 
      //     key: 'id_user'
      //   },
      //   onUpdate: 'NO ACTION',
      //   onDelete: 'SET NULL'
      // },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
  
      await queryInterface.dropTable('vehicles');
    
  }
};
