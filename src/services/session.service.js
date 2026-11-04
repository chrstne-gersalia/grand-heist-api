
const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');

const {
    notFound,
    forbidden,
    conflict,
} = require('../errors/app-error');

const { constraintOf } = require('../errors/db-errors');

const MAX_PLAYERS = 30;

function randomCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
    const session = await sessionRepository.findByCode(code);

    if (!session) {
        throw notFound(
            'SESSION_NOT_FOUND',
            `No session has the join code ${code}.`
        );
    }

    return session;
}

async function create(data, user) {
    const questionSet = await questionSetRepository.findById(data.set_id);

    if (!questionSet) {
        throw notFound(
            'QUESTION_SET_NOT_FOUND',
            `No question set has the id ${data.set_id}.`
        );
    }

    const mayUse = questionSet.host_id === user.user_id;

    if (!mayUse) {
        throw forbidden('This question set belongs to another host.');
    }

    for (let attempt = 1; attempt <= 5; attempt += 1) {
        try {
            return await sessionRepository.create({
                set_id: questionSet.set_id,
                join_code: randomCode(),
                status: 'waiting',
            });
        } catch (error) {
            if (constraintOf(error) !== 'sessions_join_code_key') {
                throw error;
            }
        }
    }

    throw conflict(
        'JOIN_CODE_GENERATION_FAILED',
        'Could not find a free join code after 5 attempts.'
    );
}

async function get(code) {
    return findOrFail(code);
}

async function update(code, changes, user) {
    const session = await findOrFail(code);

    const questionSet = await questionSetRepository.findById(session.set_id);

    if (!questionSet) {
        throw notFound(
            'QUESTION_SET_NOT_FOUND',
            `No question set has the id ${session.set_id}.`
        );
    }

    if (questionSet.host_id !== user.user_id) {
        throw forbidden('Only the host who owns this session may update it.');
    }

    const NEXT_STATUS = {
        waiting: ['playing', 'ended'],
        playing: ['ended'],
        ended: [],
    };

    if (!NEXT_STATUS[session.status]?.includes(changes.status)) {
        throw conflict(
            'INVALID_SESSION_STATUS_TRANSITION',
            `Cannot change session status from ${session.status} to ${changes.status}.`
        );
    }

    const timestamps = {};

    if (changes.status === 'playing') {
        timestamps.started_at = new Date();
    }

    if (changes.status === 'ended') {
        timestamps.ended_at = new Date();
    }

    return sessionRepository.update(session, {
        ...changes,
        ...timestamps,
    });
}

module.exports = {
    findOrFail,
    create,
    get,
    update,
    randomCode,
    MAX_PLAYERS,
};
