'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'session_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      coins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      stealth: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 100,
      },

      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'active',
      },

      tier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vault_tiers',
          key: 'tier_id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      answered_in_tier: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },

      final_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      current_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'questions',
          key: 'question_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      question_served_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    
    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_one_seat',
      fields: ['session_id', 'user_id'],
    });

    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_player_nickname',
      fields: ['session_id', 'nickname'],
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_status_valid',
      fields: ['status'],
      where: {
        status: {
          [Sequelize.Op.in]: ['active', 'busted', 'escaped'],
        },
      },
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_coins_not_negative',
      fields: ['coins'],
      where: {
        coins: {
          [Sequelize.Op.gte]: 0,
        },
      },
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_stealth_0_to_100',
      fields: ['stealth'],
      where: {
        stealth: {
          [Sequelize.Op.between]: [0, 100],
        },
      },
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_answered_not_negative',
      fields: ['answered_in_tier'],
      where: {
        answered_in_tier: {
          [Sequelize.Op.gte]: 0,
        },
      },
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_final_score_not_negative',
      fields: ['final_score'],
      where: {
        final_score: {
          [Sequelize.Op.gte]: 0,
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('players');
  },
};