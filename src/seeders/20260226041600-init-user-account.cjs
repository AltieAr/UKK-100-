'use strict';
// import user from '../models/User';
// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const adminpasswordHashed = await bcrypt.hash('admin123', 10);
    const ownerpasswordHashed = await bcrypt.hash('owner123', 10);
    const passwordHashed = await bcrypt.hash('test123', 10);
    
     await queryInterface.bulkInsert('users', [
      {
       NPWP: '5423167890',
       full_name: 'John Doe',
       password: adminpasswordHashed,
       username: 'admin',
       email: 'admin@example.com',
       phone_number: '081234567890',
       role: 'admin'
     },
     {
        full_name: 'Jane Smith',
        NPWP: '5424167890',
        password: passwordHashed,
        username: 'operator',
        email: 'operator@example.com',
        phone_number: '081234567891',
        role: 'operator'
     },
     {
        full_name: 'Alice Johnson',
        NPWP: '5425167890',
        password: ownerpasswordHashed,
        username: 'owner',
        email: 'owner@example.com',
        phone_number: '081234567892',
        role: 'owner'
     }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
