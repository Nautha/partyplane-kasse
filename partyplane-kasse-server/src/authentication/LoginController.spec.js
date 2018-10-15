const chai = require('chai');
const {LoginController} = require('./LoginController');

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('LoginController', () => {
    describe('#constructor', () => {
        it('should instantiate', () => {
            const loginController = new LoginController({});
            expect(loginController).to.be.ok;
        });

        it('should throw on missing user repository', () => {
            expect(() => new LoginController()).to.throw(Error, 'Missing parameter: userRepository');
        });
    });

    describe('#login', () => {
        it('should return a token for a avalid user', async () => {
            const userRepository = {
                getUserByUsername(username) {
                    return Promise.resolve({
                        userId: '123456789',
                        username: username,
                        name: 'Test User',
                        role: 'user',
                        hash: '$2a$10$9UC70Yw4VFPcVV/4CLvYh.FBAb/B9HleWvGoZ6HQG5HnPPK7NAdoy' //bcrypt hash for test123
                    });
                }
            };

            const loginController = new LoginController(userRepository);

            const token = await loginController.login('test', 'test123');

            expect(token).to.be.a('string');
            expect(token.startsWith('eyJhb')).to.be.true;
        });

        it('should throw an error for an invalid user', async () => {
            const userRepository = {
                getUserByUsername() {
                    return Promise.reject(new Error('User not found'));
                }
            };

            const loginController = new LoginController(userRepository);
            const promise = loginController.login('test', 'test123');
            await expect(promise).to.eventually.be.rejectedWith(Error, 'User not found');
        });

        it('should throw on wrong password', async () => {
            const userRepository = {
                getUserByUsername(username) {
                    return Promise.resolve({
                        _id: '123456789',
                        username,
                        name: 'Test User',
                        role: 'user',
                        hash: '$2a$10$9UC70Yw4VFPcVV/4CLvYh.FBAb/B9HleWvGoZ6HQG5HnPPK7NAdoy' //bcrypt hash for test123
                    });
                }
            };

            const loginController = new LoginController(userRepository);
            const promise = loginController.login('test', 'wrongPassword');

            await expect(promise).to.eventually.be.rejectedWith(Error, 'Password wrong');
        });
    })
});