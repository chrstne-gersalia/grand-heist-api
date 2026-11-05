'use strict';

/**
 * demo-users:
 * Seeds fictitious host and player accounts.
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2026-1001', username: 'heistmaster', full_name: 'Alex Morgan', email: 'alex.morgan@grandheist.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'host' },
      { school_id: '2026-1002', username: 'shadowfox', full_name: 'Daniel Reyes', email: 'daniel.reyes@grandheist.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2026-1003', username: 'nightowl', full_name: 'Samantha Cruz', email: 'samantha.cruz@grandheist.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2026-1004', username: 'quickhands', full_name: 'Michael Santos', email: 'michael.santos@grandheist.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2026-1005', username: 'vaultbreaker', full_name: 'Isabella Torres', email: 'isabella.torres@grandheist.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
      { school_id: '2026-1006', username: 'idleplayer', full_name: 'Gabriel Flores', email: 'gabriel.flores@grandheist.test', password_hash: 'FAKE_HASH_NOT_A_REAL_PASSWORD', role: 'player' },
    ]);
  },

  async down() {
    // Preserve existing demo users and Week 11 test records.
  },
};