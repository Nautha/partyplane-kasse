const bcrypt = require('bcrypt');

async function initialization(serviceLocator) {
    const databaseController = serviceLocator.get('DatabaseController');


    // await deleteTables(databaseController);

    const initNeeded = await checkInitializationNeeded(serviceLocator);


    if (!initNeeded) {
        console.log('Initialization skipped');
        return;
    }

    const userRepository = serviceLocator.get('UserRepository');

    await _createTables(databaseController);

    await createPermissions(serviceLocator);
    await createRoles(serviceLocator);
    await addPermissionsToRole(serviceLocator);

    const defaultPassword = process.env.INIT_DEFAULT_PASSWORD || generateDefaultPassword();

    const defaultAdmin = {
        username: 'admin',
        name: 'Administrator',
        role: 'admin',
        email: process.env.INIT_EMAIL || 'admin@example.com',
        hash: await bcrypt.hash(defaultPassword, 10)
        // hash: defaultPassword
    };

    await userRepository.createUser(defaultAdmin);
}

async function checkInitializationNeeded(serviceLocator) {
    return new Promise(resolve => {
        const databerController = serviceLocator.get('DatabaseController');
        databerController
            .doesTableExist('users')
            .then((result) => {
                if (result[0].length === 0) {
                    resolve(true)
                } else {
                    resolve(false);
                }
            })
            .catch(() => resolve(true));
    });
}

async function createPermissions(sl) {
    const permissionRepository = sl.get('PermissionRepository');

    const permissions = [
        {
            permission: 'user.create',
            description: 'create a user'
        },
        {
            permission: 'user.delete',
            description: 'delete a user',
        },
        {
            permission: 'user.edit',
            description: 'edit a user',
        },
        {
            permission: 'user.few',
            description: 'few user list',
        },
        {
            permission: 'transaction.add',
            description: 'add a transaction',
        },
        {
            permission: 'transaction.validate',
            description: 'validate a transaction',
        },
        {
            permission: 'transaction.view',
            description: 'view transaction list',
        }
    ];

    for(let i = 0; i < permissions.length; i++) {
        await permissionRepository.createPermission(permissions[i]);
    }
}

async function createRoles(sl) {
    const roleRepository = sl.get('RoleRepository');

    const roles = [
        {
            role: 'admin',
            description: 'administrator of the software'
        },
        {
            role: 'treasurer',
            description: 'treasurer can validate transactions'
        },
        {
            role: 'user',
            description: 'normal user'
        }
    ];

    for(let i = 0; i < roles.length; i++) {
        await roleRepository.createRole(roles[i]);
    }
}

async function addPermissionsToRole(sl) {
    const roleRepository = sl.get('RoleRepository');

    const relations = [
        {
            role: 'admin',
            permission: 'user.create'
        },
        {
            role: 'admin',
            permission: 'user.delete'
        },
        {
            role: 'admin',
            permission: 'user.edit'
        },
        {
            role: 'admin',
            permission: 'user.few'
        },
        {
            role: 'admin',
            permission: 'transaction.add'
        },
        {
            role: 'treasurer',
            permission: 'transaction.add'
        },
        {
            role: 'user',
            permission: 'transaction.add'
        },
        {
            role: 'treasurer',
            permission: 'transaction.validate'
        },
        {
            role: 'admin',
            permission: 'transaction.view'
        },
        {
            role: 'treasurer',
            permission: 'transaction.view'
        },
        {
            role: 'user',
            permission: 'transaction.view'
        }
    ];

    for(let i = 0; i < relations.length; i++) {
        await roleRepository.addPermissionToRole(relations[i]);
    }
}

async function deleteTables(databaseController) {
    const querys = [
        'DROP TABLE `transactions`;',
        'DROP TABLE `rolePermissionRelation`;',
        'DROP TABLE `users`;',
        'DROP TABLE `permissions`;',
        'DROP TABLE `roles`;'
    ];

    for(let i = 0; i < querys.length; i++) {
        databaseController.createTable(querys[i]);
    }
}

async function _createTables(databaseController) {
    const tableQuerys = [
        //PermissionTable
        'CREATE TABLE `permissions`\n' +
        '(\n' +
        ' `permission`  VARCHAR(45) NOT NULL ,\n' +
        ' `description` VARCHAR(45) NOT NULL ,\n' +
        '\n' +
        'PRIMARY KEY (`permission`)\n' +
        ');',

        //tole table
        'CREATE TABLE `roles`\n' +
        '(\n' +
        ' `role`        VARCHAR(45) NOT NULL ,\n' +
        ' `description` VARCHAR(45) NOT NULL ,\n' +
        '\n' +
        'PRIMARY KEY (`role`)\n' +
        ');',

        //rolePermissionRelationTable
        'CREATE TABLE `rolePermissionRelation`\n' +
        '(\n' +
        ' `role`       VARCHAR(45) NOT NULL ,\n' +
        ' `permission` VARCHAR(45) NOT NULL \n' +
        '\n' +
        ');',

        // user Table
        'CREATE TABLE `users`\n' +
        '(\n' +
        ' `userId`     INT NOT NULL AUTO_INCREMENT,\n' +
        ' `username`   VARCHAR(45) NOT NULL ,\n' +
        ' `name`       VARCHAR(45) NOT NULL ,\n' +
        ' `email`      VARCHAR(45) NOT NULL ,\n' +
        ' `hash`       TEXT NOT NULL ,\n' +
        ' `visibility` VARCHAR(45) DEFAULT "visible",\n' +
        ' `role`       VARCHAR(45) NOT NULL ,\n' +
        '\n' +
        'PRIMARY KEY (`userId`)\n' +
        ');',

        // transaction table
        'CREATE TABLE `transactions`\n' +
        '(\n' +
        ' `transactionId` INT NOT NULL ,\n' +
        ' `amount`        INT NOT NULL ,\n' +
        ' `purpose`       VARCHAR(45) NOT NULL ,\n' +
        ' `state`         VARCHAR(45) NOT NULL ,\n' +
        ' `userId`        INT NOT NULL ,\n' +
        '\n' +
        'PRIMARY KEY (`transactionId`)\n' +
        ');'
    ];

    for (let i = 0; i < tableQuerys.length; i++) {
        await databaseController.createTable(tableQuerys[i]);
    }
}

function generateDefaultPassword() {
    const password = Math.random().toString(36).slice(-10);
    console.log('###### PASSWORD #######');
    console.log('# You didnt specify a default password, so here is your new generated password: ');
    console.log(password);
    console.log('#######################');
    return password;
}

module.exports = {initialization};