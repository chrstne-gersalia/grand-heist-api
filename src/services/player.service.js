const playerRepository = require('../repositories/player.repository');
const vaultTierRepository = require('../repositories/vault-tier.repository');
const sessionService = require('./session.service');

const { notFound, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

const MAX_PLAYERS = 30;

async function join(code, nickname, user) {
    const session = await sessionService.findOrFail(code);

    const seat = await playerRepository.findSeat(session.session_id, user.user_id);

    if (seat) {
        return { session, player: seat, created: false };
    }

    if (session.status === 'ended') {
        throw conflict('SESSION_ENDED', 'This session has ended.');
    }

    if (session.status !== 'waiting') {
        throw conflict('SESSION_NOT_JOINABLE', 'This session has already started.');
    }

    const seatsTaken = await playerRepository.countBySession(session.session_id);

    if (seatsTaken >= MAX_PLAYERS) {
        throw conflict('SESSION_FULL', 'This session is full.');
    }

    const easyTier = await vaultTierRepository.findByName('EASY');

    if (!easyTier) {
        throw notFound('VAULT_TIER_NOT_FOUND', 'The EASY vault tier was not found.');
    }

    try {
        const player = await playerRepository.create({
            session_id: session.session_id,
            user_id: user.user_id,
            nickname,
            coins: 0,
            stealth: 100,
            status: 'active',
            tier_id: easyTier.tier_id,
            answered_in_tier: 0,
            final_score: 0,
            current_question_id: null,
            question_served_at: null,
        });

        return { session, player, created: true };
    } catch (error) {
        if (constraintOf(error) === 'uq_one_seat') {
            const existing = await playerRepository.findSeat(session.session_id, user.user_id);

            if (existing) {
                return { session, player: existing, created: false };
            }
        }

        throw error;
    }
}

async function list(code) {
    const session = await sessionService.findOrFail(code);

    const players = await playerRepository.findAllBySession(session.session_id);

    return players.map((player) => ({
        nickname: player.nickname,
        final_score: player.final_score,
    }));
}

module.exports = {
    join,
    list,
};