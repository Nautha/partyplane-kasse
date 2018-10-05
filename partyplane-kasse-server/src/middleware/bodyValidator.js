const {Validator} = require('jsonschema');

function validateBody(schema) {
    const validator = new Validator();
    return function (req, res, next) {
        const result = validator.validate(req.body, schema);
        if(result.valid) {
            next();
            return;
        }

        let messages = results.errors.map(error => error.message);

        res.status(400).json({
           message: 'Missing fields',
           reason: messages
        });
    }
}

module.exports = {validateBody};