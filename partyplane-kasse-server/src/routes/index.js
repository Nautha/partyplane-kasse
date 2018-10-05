const {helloRouter} = require('./hello');
const {authenticationRouter} = require('./authentication');
const {userRouter} = require('./user');

module.exports = {
    routes: [
        helloRouter,
        authenticationRouter,
        userRouter
    ]
};