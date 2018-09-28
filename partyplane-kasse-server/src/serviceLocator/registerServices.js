const {DatabaseController} = require('../database/DatabaseController');

function registerServices(sl) {
    //DatabaseController
    sl.register('DatabaseController', new DatabaseController());
}

module.exports = {registerServices};