const {DatabaseController} = require('../database/DatabaseController');
const {UserRepository} = require('../users/UserRepository');
const {UserController} = require('../users/UserController');
const {RoleRepository} = require('../authentication/database/RoleRepository');
const {PermissionRepository} = require('../authentication/database/PermissionRepository');


function registerServices(sl) {
    //DatabaseController
    sl.register('DatabaseController', new DatabaseController());

    //UserManagement
    sl.register('UserRepository', new UserRepository(sl.get('DatabaseController')));
    sl.register('UserController', new UserController(sl.get('UserRepository')));

    //RoleManagement
    sl.register('RoleRepository', new RoleRepository(sl.get('DatabaseController')));

    //PermissionManagement
    sl.register('PermissionRepository', new PermissionRepository(sl.get('DatabaseController')));
}

module.exports = {registerServices};