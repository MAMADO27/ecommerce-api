const { param, validationResult } = require('express-validator');
const validator_middelware= (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };



module.exports = validator_middelware;