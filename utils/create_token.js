const jwt = require('jsonwebtoken');
const create_token = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

module.exports = create_token;