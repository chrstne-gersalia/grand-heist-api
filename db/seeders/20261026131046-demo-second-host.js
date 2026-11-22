'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2026-1007',
        username: 'secondhost',
        full_name: 'Ben Castro',
        email: 'ben.castro@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'host',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2026-1007' }, {});
  },
};