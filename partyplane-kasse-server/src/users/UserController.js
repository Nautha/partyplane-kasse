const zxcvbn = require('zxcvbn');
const bcrypt = require('bcrypt');

class PasswordRejectedError extends Error {
    constructor(result) {
        super(`Password does not meet requirements: ${result.feedback.warning}`);
        this.result = result;
    }

    getResult() {
        return this.result;
    }
}

class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getUserList() {
        const users = await this.userRepository.getAllUsers();
        return users.map(u => ({
            username: u.username,
            name: u.name,
            email: u.email,
            role: u.role
        }));
    }

    async createUser(userData) {
        this._verifyPassword(userData);

        const numRows = await this.userRepository.getUserByUsername(userData.username.toLowerCase());
        if(numRows.length !== 0) {
            throw new Error('Username already used');
        }

        const hash = await bcrypt.hash(userData.password, 10);

        const user = await this.userRepository.createUser({
            username: userData.username.toLowerCase(),
            name: userData.name,
            role: userData.role,
            email: userData.email,
            hash: hash
        });

        return user;
    }

    _verifyPassword(userData) {
        const userInput = [
            userData.username,
            userData.name,
            userData.role,
            userData.email
        ];

        const passwordResult = zxcvbn(userData.password, userInput);
        if(passwordResult.score < 3) {
            throw new PasswordRejectedError(passwordResult);
        }
    }

}

module.exports = {UserController, PasswordRejectedError};