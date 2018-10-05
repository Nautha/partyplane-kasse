class PermissionRepository {
    constructor(dataBaseController) {
        this.databaseController = dataBaseController;
    }

    async createPermission(permissionData) {
        const query = "INSERT INTO permissions (permission, description) VALUES (?, ?)";
        const params = [permissionData.permission, permissionData.description];
        return await this.databaseController.query(query, params);
    }

    async userHasPermission(userId, permissionId) {
        const query = "SELECT * FROM rolepermissionrelation WHERE permission = ? AND role = (SELECT role FROM users WHERE userId = ?)";
        const params = [permissionId, userId];
        const permission = await this.databaseController.query(query, params);
        return permission.length !== 0;
    }
}

module.exports = {PermissionRepository};