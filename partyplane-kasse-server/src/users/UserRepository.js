class UserRepository {
    constructor(DatabaseController) {
        this.DatabaseController = DatabaseController;
    }

    async getUserByUsername(username) {
        const query = "SELECT * from users WHERE username = ?";
        const params = [username];

        try {
        const user = await this.DatabaseController.query(query, params);
        if(!user) {
            throw new Error('User not found');
        }
        return user[0];
        } catch (e) {
            console.log(e);
        }
    }

    async createUser(userData) {
        const query = "INSERT INTO users (username, name, email, hash, role) VALUES (?, ?, ?, ?, ?)";
        const params = [userData.username, userData.name, userData.email, userData.hash, userData.role];
        return await this.DatabaseController.query(query, params);
    }

    async getAllUsers() {
        const query = "SELECT * FROM users WHERE visibility = 'visible'";
        return await this.DatabaseController.query(query);
    }

    async getDeletedUsers() {
        const query = "SELECT * FROM users WHERE visibility = 'deleted'";
        return await this.DatabaseController.query(query);
    }
}

module.exports = {UserRepository};