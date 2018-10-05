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
        return user;
        } catch (e) {
            console.log(e);
        }
    }

    async createUser(userData) {
        const query = "INSERT INTO users (username, name, email, hash, role) VALUES (?, ?, ?, ?, ?)";
        const params = [userData.username, userData.name, userData.email, userData.hash, userData.role];
        return await this.DatabaseController.query(query, params);
    }
}

module.exports = {UserRepository};