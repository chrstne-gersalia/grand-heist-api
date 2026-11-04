// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.
const { UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

function constraintOf(error) {
  if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }

  const dbError = error.parent || error.original || error;

  if (['23505', '23503', '23001'].includes(dbError.code)) {
    return dbError.constraint || null;
  }

  return null;
}

module.exports = { constraintOf };
