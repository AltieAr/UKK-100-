'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('fees', {
      id_fees: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      // jenis_kendaraan: {
      //   type: Sequelize.STRING(50), 
      //   allowNull: false
      // },
      id_type: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vehicle_types',
          key: 'id_type'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'SET NULL'
      },
      fees_per_hour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.dropTable('fees');
     
  }
};
