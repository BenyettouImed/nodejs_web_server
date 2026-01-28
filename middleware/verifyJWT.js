const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt){ // cookies?.jwt means if we have cookies then check for jwt
        return res.sendStatus(401); // unauthorized
    }
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401); // unauthorized
    console.log('auth header heeeeeeereeeeeeeee!!!!!!!', authHeader); // Bearer <AccessToken>
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);// forbidden, invalid token
            req.user = decoded.username;
            next();
        }
    )
}

module.exports = verifyJWT;