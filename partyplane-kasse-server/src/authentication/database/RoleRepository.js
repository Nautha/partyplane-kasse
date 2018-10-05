class RoleRepository {
    constructor(DatabaseController) {
        if(!DatabaseController) {
            throw new Error('Missing parameter: DatabaseController');
        }
        this.DatabaseController = DatabaseController;
    }

    async getRoleByName(name) {
        const query = "SELECT * FROM roles WHERE role = ?";
        const params = [name];
        const role = await this.DatabaseController.query(query, params);
        if(!role) {
            throw new Error('Role not found');
        }
        return role;
    }

    async createRole(roleData) {
        const query = "INSERT INTO roles (role, description) VALUES (?, ?)";
        const params = [roleData.role, roleData.description];
        return await this.DatabaseController.query(query, params);
    }

    async addPermissionToRole(data) {
        const query = "INSERT INTO rolepermissionrelation (role, permission) VALUES (?, ?)";
        const params = [data.role, data.permission];
        return await this.DatabaseController.query(query, params);
    }
}

module.exports = {RoleRepository};