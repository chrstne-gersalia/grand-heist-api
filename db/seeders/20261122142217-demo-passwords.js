'use strict';

const password = require('../../src/security/password');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await password.hash('GrandHeist123');

    await queryInterface.bulkUpdate(
      'users',
      { password_hash: hash },
      { password_hash: null },
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    // No rollback: preserve demo account passwords.
  }
};