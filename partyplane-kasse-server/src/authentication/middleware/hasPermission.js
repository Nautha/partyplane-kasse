const PermissionRepository = require('../database/PermissionRepository');

function hasPermission(permission) {
    return function (req, res, next) {
        const permissionRepository = res.app.locals.serviceLocator.get('PermissionRepository');
        if(permissionRepository.userHasPermission(req.user.sub, permission)) {
            next();
            return;
        }

        res.status(403).json({
            message: 'No Authorization'
        });
    }
}

module.exports = {hasPermission};