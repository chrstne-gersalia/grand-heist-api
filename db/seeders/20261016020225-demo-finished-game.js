
'use strict';

/**
 * demo-finished-game:
 * Seeds every table except users.
 * Uses database lookups for generated IDs.
 * All sample data is fictitious.
 */

const EQUIPMENT_NAMES = [
  'Coin Pouch',
  'Stealth Tonic',
  'Loot Box',
  'Vault Shield',
  'Double Take',
  'Pickpocket',
  'Anti-Debuff Potion',
  'Reversal',
];

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;
    const transaction = await db.transaction();

    const at = (time) => new Date(`2026-10-06T${time}Z`);

    const find = async (sql, replacements = {}) => {
      const [rows] = await db.query(sql, {
        transaction,
        replacements,
      });

      if (!rows.length) {
        throw new Error(`Seeder lookup found nothing: ${sql}`);
      }

      return rows[0];
    };

    const insert = (table, rows) =>
      queryInterface.bulkInsert(table, rows, { transaction });

    try {
      // 1. Vault tiers
      await insert('vault_tiers', [
        {
          tier_name: 'EASY',
          coin_multiplier: 1.0,
          stealth_penalty: 10,
          loot_rate: 1.0,
          unlock_threshold: 0,
        },
        {
          tier_name: 'NORMAL',
          coin_multiplier: 1.5,
          stealth_penalty: 20,
          loot_rate: 1.5,
          unlock_threshold: 3,
        },
        {
          tier_name: 'HARD',
          coin_multiplier: 2.0,
          stealth_penalty: 35,
          loot_rate: 2.0,
          unlock_threshold: 3,
        },
      ]);

      const tiers = {};

      for (const name of ['EASY', 'NORMAL', 'HARD']) {
        tiers[name] = (
          await find(
            'SELECT tier_id FROM vault_tiers WHERE tier_name = :name',
            { name }
          )
        ).tier_id;
      }

      // 2. Question set
      const host = await find(
        'SELECT user_id FROM users WHERE school_id = :school',
        { school: '2026-1001' }
      );

      await insert('question_sets', [
        {
          host_id: host.user_id,
          title: 'General Knowledge Challenge',
        },
      ]);

      const questionSet = await find(
        'SELECT set_id FROM question_sets WHERE title = :title',
        { title: 'General Knowledge Challenge' }
      );

      // 3. Questions and choices
      const questions = [
        {
          text: 'Which planet is known as the Red Planet?',
          correct: 1,
          choices: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
        },
        {
          text: 'How many sides does a hexagon have?',
          correct: 2,
          choices: ['Five', 'Seven', 'Six', 'Eight'],
        },
        {
          text: 'What is the largest ocean on Earth?',
          correct: 0,
          choices: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
        },
        {
          text: 'What is the chemical symbol for water?',
          correct: 1,
          choices: ['CO2', 'H2O', 'O2', 'NaCl'],
        },
        {
          text: 'Which animal is a mammal?',
          correct: 3,
          choices: ['Crocodile', 'Eagle', 'Frog', 'Dolphin'],
        },
      ];

      await insert(
        'questions',
        questions.map((question) => ({
          set_id: questionSet.set_id,
          question_text: question.text,
          question_type: 'MULTIPLE_CHOICE',
          correct_index: question.correct,
          time_limit_sec: 20,
        }))
      );

      for (const question of questions) {
        question.question_id = (
          await find(
            `SELECT question_id
             FROM questions
             WHERE set_id = :setId AND question_text = :text`,
            {
              setId: questionSet.set_id,
              text: question.text,
            }
          )
        ).question_id;
      }

      await insert(
        'question_choices',
        questions.flatMap((question) =>
          question.choices.map((choice_text, choice_index) => ({
            question_id: question.question_id,
            choice_index,
            choice_text,
          }))
        )
      );

      // 4. Equipment
      await insert('equipment', [
        { name: 'Coin Pouch', equipment_type: 'BENEFICIAL', price: 100, sell_value: 50 },
        { name: 'Stealth Tonic', equipment_type: 'BENEFICIAL', price: 120, sell_value: 60 },
        { name: 'Loot Box', equipment_type: 'BENEFICIAL', price: 100, sell_value: 50 },
        { name: 'Vault Shield', equipment_type: 'DEFENSE', price: 150, sell_value: 75 },
        { name: 'Double Take', equipment_type: 'BUFF', price: 200, sell_value: 100 },
        { name: 'Pickpocket', equipment_type: 'SABOTAGE', price: 180, sell_value: 90 },
        { name: 'Anti-Debuff Potion', equipment_type: 'SPECIAL', price: 120, sell_value: 60 },
        { name: 'Reversal', equipment_type: 'SPECIAL', price: 160, sell_value: 80 },
      ]);

      const equipment = {};

      for (const name of EQUIPMENT_NAMES) {
        equipment[name] = (
          await find(
            'SELECT equipment_id FROM equipment WHERE name = :name',
            { name }
          )
        ).equipment_id;
      }

      // 5. Equipment subtype tables
      await insert('beneficial_items', [
        { equipment_id: equipment['Coin Pouch'], benefit_kind: 'COINS', amount: 150 },
        { equipment_id: equipment['Stealth Tonic'], benefit_kind: 'STEALTH', amount: 20 },
        { equipment_id: equipment['Loot Box'], benefit_kind: 'LOOT_BOX', amount: 200 },
      ]);

      await insert('defense_items', [
        { equipment_id: equipment['Vault Shield'], max_charges: 1, blocks_kind: 'PICKPOCKET' },
      ]);

      await insert('buff_items', [
        { equipment_id: equipment['Double Take'], effect_type: 'COIN_MULTIPLIER', modifier: 2.0, duration_questions: 3 },
      ]);

      await insert('sabotage_items', [
        { equipment_id: equipment['Pickpocket'], sabotage_kind: 'PICKPOCKET', percent: 15 },
      ]);

      await insert('special_items', [
        { equipment_id: equipment['Anti-Debuff Potion'], special_kind: 'ANTI_DEBUFF' },
        { equipment_id: equipment['Reversal'], special_kind: 'REVERSAL' },
      ]);

      // 6. Finished game session
      await insert('sessions', [
        {
          join_code: '583721',
          set_id: questionSet.set_id,
          status: 'ended',
          started_at: at('10:00:00'),
          ended_at: at('10:30:00'),
        },
      ]);

      const session = await find(
        'SELECT session_id FROM sessions WHERE join_code = :code',
        { code: '583721' }
      );

      // 7. Players
      const seats = [
        {
          school: '2026-1002',
          nickname: 'ShadowFox',
          coins: 500,
          stealth: 80,
          status: 'escaped',
          tier: 'NORMAL',
          score: 500,
          completed: true,
        },
        {
          school: '2026-1003',
          nickname: 'NightOwl',
          coins: 450,
          stealth: 75,
          status: 'escaped',
          tier: 'NORMAL',
          score: 450,
          completed: true,
        },
        {
          school: '2026-1004',
          nickname: 'QuickHands',
          coins: 400,
          stealth: 65,
          status: 'escaped',
          tier: 'EASY',
          score: 400,
          completed: true,
        },
        {
          school: '2026-1005',
          nickname: 'VaultBreaker',
          coins: 100,
          stealth: 0,
          status: 'busted',
          tier: 'HARD',
          score: 100,
          completed: false,
        },
      ];

      const playerIds = {};

      for (const seat of seats) {
        const user = await find(
          'SELECT user_id FROM users WHERE school_id = :school',
          { school: seat.school }
        );

        await insert('players', [
          {
            session_id: session.session_id,
            user_id: user.user_id,
            nickname: seat.nickname,
            coins: seat.coins,
            stealth: seat.stealth,
            status: seat.status,
            tier_id: tiers[seat.tier],
            answered_in_tier: seat.completed ? 5 : 1,
            final_score: seat.score,
            current_question_id: null,
            question_served_at: null,
          },
        ]);

        playerIds[seat.nickname] = (
          await find(
            `SELECT player_id
             FROM players
             WHERE session_id = :sessionId AND nickname = :nickname`,
            {
              sessionId: session.session_id,
              nickname: seat.nickname,
            }
          )
        ).player_id;
      }

      // 8. Answers and reward offers
      let offerCount = 0;

      for (const seat of seats) {
        const questionCount = seat.completed ? questions.length : 2;

        for (let i = 0; i < questionCount; i++) {
          const question = questions[i];
          const correct = seat.completed || i === 0;
          const choiceIndex = correct
            ? question.correct
            : (question.correct + 1) % question.choices.length;

          await insert('answers', [
            {
              player_id: playerIds[seat.nickname],
              question_id: question.question_id,
              choice_index: choiceIndex,
              is_correct: correct,
              submitted_at: at(`10:${String(1 + i).padStart(2, '0')}:00`),
            },
          ]);

          if (!correct) continue;

          const answer = await find(
            `SELECT answer_id
             FROM answers
             WHERE player_id = :playerId AND question_id = :questionId`,
            {
              playerId: playerIds[seat.nickname],
              questionId: question.question_id,
            }
          );

          await insert('reward_offers', [
            {
              answer_id: answer.answer_id,
              created_at: at(`10:${String(1 + i).padStart(2, '0')}:05`),
              is_chosen: true,
            },
          ]);

          const offer = await find(
            'SELECT offer_id FROM reward_offers WHERE answer_id = :answerId',
            { answerId: answer.answer_id }
          );

          await insert(
            'reward_offer_options',
            [1, 2, 3].map((option_index) => ({
              offer_id: offer.offer_id,
              option_index,
              equipment_id:
                equipment[
                  EQUIPMENT_NAMES[
                    (offerCount + option_index) % EQUIPMENT_NAMES.length
                  ]
                ],
            }))
          );

          offerCount++;
        }
      }

      // 9. Inventory
      await insert('inventory_items', [
        {
          player_id: playerIds.ShadowFox,
          equipment_id: equipment['Vault Shield'],
          slot_no: 1,
          acquired_at: at('10:05:00'),
          armed_at: null,
          charges_left: 1,
        },
        {
          player_id: playerIds.NightOwl,
          equipment_id: equipment['Pickpocket'],
          slot_no: 1,
          acquired_at: at('10:08:00'),
          armed_at: null,
          charges_left: 1,
        },
      ]);

      // 10. Status effect
      await insert('status_effects', [
        {
          player_id: playerIds.VaultBreaker,
          effect_type: 'CURSED',
          magnitude: 1.0,
          questions_left: 1,
        },
      ]);

      // 11. Shop listings
      await insert('shop_listings', [
        { session_id: session.session_id, equipment_id: equipment['Coin Pouch'], stock: 5 },
        { session_id: session.session_id, equipment_id: equipment['Stealth Tonic'], stock: 5 },
        { session_id: session.session_id, equipment_id: equipment['Vault Shield'], stock: 3 },
        { session_id: session.session_id, equipment_id: equipment['Double Take'], stock: 2 },
      ]);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const del = (table, where) =>
        queryInterface.bulkDelete(table, where, { transaction });

      await del('sessions', { join_code: '583721' });
      await del('equipment', { name: EQUIPMENT_NAMES });
      await del('question_sets', { title: 'General Knowledge Challenge' });
      await del('vault_tiers', { tier_name: ['EASY', 'NORMAL', 'HARD'] });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
