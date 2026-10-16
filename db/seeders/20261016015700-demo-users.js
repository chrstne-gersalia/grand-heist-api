'use strict';

const SCHOOL_IDS = [
  '2026-1001',
  '2026-1002',
  '2026-1003',
  '2026-1004',
  '2026-1005',
  '2026-1006',
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2026-1001',
        username: 'heistmaster',
        full_name: 'Alex Morgan',
        email: 'alex.morgan@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'host',
      },
      {
        school_id: '2026-1002',
        username: 'shadowfox',
        full_name: 'Daniel Reyes',
        email: 'daniel.reyes@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'player',
      },
      {
        school_id: '2026-1003',
        username: 'nightowl',
        full_name: 'Samantha Cruz',
        email: 'samantha.cruz@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'player',
      },
      {
        school_id: '2026-1004',
        username: 'quickhands',
        full_name: 'Michael Santos',
        email: 'michael.santos@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'player',
      },
      {
        school_id: '2026-1005',
        username: 'vaultbreaker',
        full_name: 'Isabella Torres',
        email: 'isabella.torres@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'player',
      },
      {
        school_id: '2026-1006',
        username: 'idleplayer',
        full_name: 'Gabriel Flores',
        email: 'gabriel.flores@grandheist.test',
        password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD',
        role: 'player',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      { school_id: SCHOOL_IDS },
      {}
    );
  },
};