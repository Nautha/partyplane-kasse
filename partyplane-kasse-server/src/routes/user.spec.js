const chai = require('chai');
chai.use(require('chai-as-promised'));
// chai.use(require('chai-http'));
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');

// const bodyParser = require('body-parser');
const {ServiceLocator} = require('../servicelocator/ServiceLocator');
const {getUserListHandler, createUserHandler} = require('./user');
// const {LoginController} = require('../authentication/LoginController');
// const {createUserHandler, getUserListHandler} = require('./user');
const {PasswordRejectedError} = require('../users/UserController');

describe('User Router', () => {
    describe('GET /users', () => {
        it('should respond with a list of users', async () => {
            const serviceLocator = new ServiceLocator();

            const testUser = {
                sub: '0',
                username: 'testuser',
                name: 'Test User',
                role: 'admin',
                email: 'test@example.com'
            };

            const testResponse = [
                {
                    "username": "test",
                    "name": "test",
                    "email": "test@test.de",
                    "role": "user"
                }
            ];

            const userController = {
                getUserList: sinon.fake.resolves(testResponse)
            };

            serviceLocator.register('UserController', userController);

            const req = {
                user: testUser
            };

            const res = {
                app: {locals: {serviceLocator}},
                status: sinon.fake(),
                json: sinon.fake()
            };

            await getUserListHandler(req, res);

            expect(userController.getUserList).to.have.been.called;
            expect(res.json).to.have.been.calledWith(testResponse);

        });

    });

    describe('POST /users', () => {
        it('should relay the transaction information to the controller', async () => {
             const serviceLocator = new ServiceLocator();

             const testUser = {
                 username: 'testuser',
                 name: 'Test User',
                 role: 'admin',
                 email: 'test@example.com',
                 password: 'correcthorsebatterystaple'
             };

             const testUserResponse = {
                 ...testUser
             };

             const userController = {
                 createUser: sinon.fake.resolves(testUserResponse)
             };

             serviceLocator.register('UserController', userController);

             const req = {
                 body: testUser
             };

             const res = {
                 app: {locals: {serviceLocator}},
                 status: sinon.fake(),
                 json: sinon.fake()
             };

             await createUserHandler(req, res);

             expect(userController.createUser).to.have.been.calledWith(testUser);
             expect(res.json).to.have.been.calledWith(testUserResponse);
             // console.log('--------------------');
             // console.log('ERROR MESSAGE:');
             // console.log(res);
             // console.log('--------------------');
             // expect(res).to.have.status(200);
             // expect(res).to.be.json;
             // expect(res.body).to.be.deep.equal({
             //     username: 'test',
             //     email: 'test@example.com',
             //     name: 'Test',
             //     role: 'admin'
             // });
        });

        it('should reject unsafe passwords', async () => {
            const serviceLocator = new ServiceLocator();

            const testUser = {
                username: 'test',
                email: 'test@example.com',
                name: 'Test',
                role: 'admin',
                password: '12345678'
            };

            const testResponse = {
                message: 'Password rejected',
                reason: 'Password does not meet requirements: test'
            };

            const userController = {
                createUser: sinon.fake.rejects(new PasswordRejectedError({
                    feedback: {
                        warning: 'test'
                    }
                }))
            };

            serviceLocator.register('UserController', userController);

            const req = {
                body: testUser
            };

            const res = {
                app: {locals: {serviceLocator}},
                status: sinon.fake.returns({json: sinon.fake()}),
                json: sinon.fake()
            };

            await createUserHandler(req, res);

            // expect(userController.createUser).to.have.been.calledWith(testUser);
            // await expect(userController.createUser).to.be.rejectedWith(PasswordRejectedError);
            // expect(res).to.have.status(400);
            expect(res.json).to.have.been.calledWith(testResponse);
        });

        it('should reject duplicate username', async () => {

        });
    })
});