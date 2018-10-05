const router = require('express').Router();
const {validateBody} = require('../middleware/bodyValidator');
const {wrapAsync: wa} = require('../middleware/wrapAsync');

const loginSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    },
    required: ['username', 'password'],
    additionalProperties: false
};

async function login(req, res) {
    const sl = res.app.locals.serviceLocator;
    const loginController = sl.get('LoginController');

    const {username, password} = req.body;
    try {
        const token = await loginController.login(username, password);

        res.json({
            token
        })
    } catch (e) {
        res.status(403).json({
            message: 'Not successful',
            reason: e
        });
    }
}

router.post(
    '/login',
    validateBody(loginSchema),
    wa(login)
);

module.exports = {authenticationRouter: router, login};
