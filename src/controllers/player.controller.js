const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

async function join(req, res) {
    const { code, nickname } = matchedData(req);

    const { session, player, created } = await playerService.join(code, nickname, req.user);

    // 201 Created for a new seat, 200 OK when the account already had one (rejoin).
    res.status(created ? 201 : 200).json({
        player_id: player.player_id,
        nickname: player.nickname,
        coins: player.coins,
        stealth: player.stealth,
        final_score: player.final_score,
        tier_id: player.tier_id,
        current_question_id: player.current_question_id,
        answered_in_tier: player.answered_in_tier,
        rejoined: !created,
        session: {
            code: session.join_code,
            status: session.status,
        },
    });
}

async function list(req, res) {
    const { code } = matchedData(req);

    const players = await playerService.list(code);

    res.status(200).json({ players });
}

module.exports = {
    join,
    list,
};