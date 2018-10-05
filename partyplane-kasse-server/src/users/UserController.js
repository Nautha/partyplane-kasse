const zxcvbn = require('zxcvbn');
const bcrypt = require('bcrypt');

class PasswordRejectedError extends Error {
    constructor(result) {
        super(`PAssword does not meet requirements: ${result.feedback.warning}`);
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


}

module.exports = {UserController, PasswordRejectedError};