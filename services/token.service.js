const jwt = require("jsonwebtoken");
const moment = require("moment");

const generateToken = async (
    userId,
    role,
    expires,
    type,
    secret = process.env.JWT_SECRET
) => {
    const payload = {
        sub: userId,
        role,
        iat: moment().unix(), // issued at
        exp: expires.unix(), // expiration time,
        type,
    };

    return jwt.sign(payload, secret);
};

module.exports = { generateToken };
