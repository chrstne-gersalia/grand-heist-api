const { GameSession } = require('../models');

function findAll() {
    return GameSession.findAll();
}

function findById(sessionId) {
    return GameSession.findByPk(sessionId);
}

function findByCode(joinCode) {
    return GameSession.findOne({ where: { join_code: joinCode } });
}

function create(data) {
    return GameSession.create(data);
}

function update(session, changes) {
    return session.update(changes);
}

module.exports = {
    findAll,
    findById,
    findByCode,
    create,
    update,
};