const {helloRouter} = require('./hello');
const {authenticationRouter} = require('./authentication');

module.exports = {
    routes: [
        helloRouter,
        authenticationRouter
    ]
};