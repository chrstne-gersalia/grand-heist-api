'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      join_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true,
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'set_id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'waiting',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('sessions', {
      type: 'check',
      name: 'ck_sessions_status_valid',
      fields: ['status'],
      where: {
        status: {
          [Sequelize.Op.in]: ['waiting', 'playing', 'ended'],
        },
      },
    });

    await queryInterface.addConstraint('sessions', {
      type: 'check',
      name: 'ck_sessions_join_code_format',
      fields: ['join_code'],
      where: Sequelize.literal("join_code ~ '^[1-9][0-9]{5}$'"),
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  },
};