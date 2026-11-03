const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

// What a client is allowed to see of a session.
function toJson(session) {
  return {
    session_id: session.session_id,
    code: session.join_code,
    set_id: session.set_id,
    status: session.status,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(data, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req);
  const session = await sessionService.get(code);
  res.status(200).json(toJson(session));
}

async function update(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const session = await sessionService.update(code, changes, req.user);
  res.status(200).json(toJson(session));
}

module.exports = { create, get, update };