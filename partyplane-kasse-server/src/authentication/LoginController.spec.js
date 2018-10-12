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

        });
    })
});