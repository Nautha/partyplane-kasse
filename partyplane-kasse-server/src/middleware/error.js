const crypto = require('crypto');

function errorHandler(err, req, res, next) {
    const id = crypto.randomBytes(16).toString('hex');
    console.log("\x1b[31m%s\x1b[0m", '[Express Handler]', id, err);
    res.status(500).json({
        message: 'Internal Server Error',
        errorId: id
    });
    next();
}

module.exports = {errorHandler};