const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const title = () => body('title')                 // title VARCHAR(80) NOT NULL
  .exists().withMessage('title is required')
  .bail()                                         // stop this field at the first failure
  .isString().withMessage('title must be text')
  .bail()
  .trim()                                         // cut spaces BEFORE measuring
  .isLength({ min: 3, max: 80 }).withMessage('title must be 3 to 80 characters long');

const createRules = [title()];

// PATCH changes only what is sent: every field is optional, but not all of them at once.
const updateRules = [
  idParam,
  title().optional(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.includes('title')) {
      throw new Error('send at least one field: title');
    }
    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };