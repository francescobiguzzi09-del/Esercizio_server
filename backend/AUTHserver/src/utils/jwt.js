const jwt = require('jsonwebtoken');
const config = require('../../config/env');

function generateAuthToken(dbUser) {
    return jwt.sign(
        {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName,
            displayName: dbUser.displayName
        },
        config.JWT_SECRET,
        { expiresIn: '8h' }
    );
}

module.exports = { generateAuthToken };