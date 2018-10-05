const router = require('express').Router();
const {isAuthenticated} = require('../authentication/middleware/isAuthenticated');
const {hasPermission} = require('../authentication/middleware/hasPermission');
const {validateBody} = require('../middleware/bodyValidator');
const {wrapAsync: wa} = require('../middleware/wrapAsync');
const {PasswordRejectedError} = require('../users/UserController');

const createUserSchema = {
    type: 'object',
    properties: {
        username: {type: 'string'},
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string',
            minLength: 8
        },
        name: {
            type: 'string'
        },
        role: {
            type: 'string',
            enum: ['user', 'admin', 'treasurer']
        }
    },
    required: ['username', 'email', 'password', 'name', 'role'],
    additionalProperties: false
};

async function createUser(req, res) {
    const sl = res.app.locals.serviceLocator;
    const userController = sl.get('UserController');

    try {
        const user = await userController.createUser(req.body);
        res.json(user);
    } catch (e) {
        if(e instanceof PasswordRejectedError) {
            res.status(400).json({
                message: 'Password rejected',
                reason: e.message
            });
        } else if(e.message === "Username already used") {
            res.status(400).json({
                message: 'Error',
                reason: e.message
            });
        }
        else {
            throw e;
        }
    }
}

router.post(
    '/users',
    isAuthenticated(true),
    hasPermission('user.create'),
    validateBody(createUserSchema),
    wa(createUser)
);

module.exports = {userRouter: router};