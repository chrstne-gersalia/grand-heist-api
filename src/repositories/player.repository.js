const { Player } = require('../models');

function findAllBySession(sessionId) {
    return Player.findAll({ where: { session_id: sessionId } });
}

function findSeat(sessionId, userId) {
    return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

function countBySession(sessionId) {
    return Player.count({ where: { session_id: sessionId } });
}

function create(data) {
    return Player.create(data);
}

module.exports = {
    findAllBySession,
    findSeat,
    countBySession,
    create,
};