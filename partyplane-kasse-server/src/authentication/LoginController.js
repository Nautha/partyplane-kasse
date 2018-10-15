const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_KEY = Buffer.from(process.env.JWT_KEY, 'base64');

class LoginController {
    constructor(userRepository) {
        if(!userRepository) {
            throw new Error('Missing parameter: userRepository');
        }
        this.userRepository = userRepository;
    }

    async login(username, password) {
        const user = await this.userRepository.getUserByUsername(username);

        if(await this._verifyPassword(password, user.hash)) {
            return await LoginController.generateToken(user);
        }
        throw new Error('Password wrong');
    }

    async _verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    static generateToken(user) {
        return jwt.sign({
            name: user.name,
            role: user.role,
            username: user.username
        }, JWT_KEY, {
            expiresIn: "1d",
            subject: user.userId.toString()
        });
    }
}

module.exports = {LoginController};