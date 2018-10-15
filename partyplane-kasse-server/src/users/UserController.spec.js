const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');

const {UserController, PasswordRejectedError} = require('./UserController');

describe('UserController', () => {
    describe('createUser', () => {
        it('should reject users with low password complexity', async () => {
            const fakeUserRepository = {
                createUser: sinon.fake.resolves({}),
                getUserByUsername: sinon.fake.resolves([])
            };

            const userController = new UserController(fakeUserRepository);

            const promise = userController.createUser({
                username: 'test',
                email: 'test@example.com',
                password: '12345',
                role: 'user',
                name: 'Test'
            });
            expect(promise).to.eventually.be.rejectedWith(PasswordRejectedError);
            try {
                await promise;
            } catch (e) {
                expect(e.getResult()).to.have.property('score');
            }
            expect(fakeUserRepository.createUser).not.to.have.been.called;
        });

        it('should allow users with high password complexity', async () => {
            const fakeUserRepository = {
                createUser: sinon.fake.resolves({}),
                getUserByUsername: sinon.fake.resolves([])
            };

            const userController = new UserController(fakeUserRepository);

            const promise = userController.createUser({
                username: 'test',
                email: 'test@example.com',
                password: 'this should be a very complex password that cannot be easily guessed',
                role: 'user',
                name: 'Test'
            });

            await expect(promise).to.eventually.be.fulfilled;
            await promise;
            await expect(fakeUserRepository.createUser).to.have.been.calledOnce;
        });

        it('should reject duplicate users', async () => {
            const fakeUserRepository = {
                createUser: sinon.fake.resolves({}),
                getUserByUsername: sinon.fake.resolves([{
                    username: 'test',
                    email: 'test@example.com',
                    role: 'user',
                    name: 'Test'
                }])
            };

            const userController = new UserController(fakeUserRepository);

            const promise = userController.createUser({
                username: 'test',
                email: 'test@example.com',
                password: 'this should be a very complex password that cannot be easily guessed',
                role: 'user',
                name: 'Test'
            });

            await expect(promise).to.eventually.be.rejected;
            try {
                await promise;
            } catch (e) {
                expect(e.message).to.equal('Username already used');
            }
        })
    });

    describe('getUserList', () => {
        it('should not return extra properties', async () => {
            const fakeUserRepository = {
                getAllUsers: sinon.fake.resolves([{
                    username: 'test',
                    name: 'Test',
                    email: 'test@example.com',
                    role: 'admin',
                    hash: '$2y$...'
                }])
            };

            const userController = new UserController(fakeUserRepository);

            const promise = userController.getUserList();

            await expect(promise).to.eventually.deep.equal([{
                username: 'test',
                name: 'Test',
                email: 'test@example.com',
                role: 'admin'
            }]);
            await promise;
            await expect(fakeUserRepository.getAllUsers).to.have.been.calledOnce;
        })
    });
});