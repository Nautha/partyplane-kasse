const jwt = require('jsonwebtoken');

const JWT_KEY = Buffer.from(process.env.JWT_KEY, 'base64');

function isAuthenticated(authenticationStatus) {
    return (req, res, next) => {
        if(!("authorization" in req.headers)) {
            if(authenticationStatus) {
                res.status(401).json({
                    message: 'Authentication required',
                    requiredHeaders: ['Authorization']
                });
                return;
            } else {
                next();
                return;
            }
        }

        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader.startsWith('Bearer ')) {
            res.status(400).json({
                message: 'Wrong authorization header scheme'
            });
            return;
        }

        const token = authorizationHeader.substr('Bearer '.length);
        const result = isJWTValid(token);

        if(result.valid === false) {

            if(result.error === 'expired') {
                res.status(401).json({
                    message: 'invalid token',
                    reason: 'expired'
                });
            } else {
                res.status(400).json({
                    message: 'invalid token',
                    reason: 'malformed'
                });
            }
            return;
        }

        if(authenticationStatus) {
            req.user = result.data;
            next();
            return;
        }
        res.status(403).json({
            message: 'You need to be logged out'
        });
    };
}

function isJWTValid(token) {
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        return {
            valid: true,
            data: decoded
        };
    } catch (e) {
        switch (e.name) {
            case 'TokenExpiredError':
                return {
                    valid: false,
                    error: 'expired'
                };
            case 'JsonWebTokenError':
                return {
                    valid: false,
                    error: e.message
                };
        }
    }
}

module.exports = {isAuthenticated};