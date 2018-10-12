const express = require('express');
const jwt = require('jsonwebtoken');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));
const expect = chai.expect;

const {isAuthenticated} = require('./isAuthenticated');

describe('isAuthenticated(true/false) middleware', () => {
    describe('isAuthenticated(true)', () => {
        let app;
        before(() => {
            app = express();
            app.get('/', isAuthenticated(true), (req, res) => {
                res.json({success: true});
            });
        });

        it('should disallow requests without authorization header', async () => {
            const res = await chai.request(app).get('/');

            expect(res).to.have.status(401);
            expect(res).to.be.json;
            expect(res.body.message).to.equal('Authentication required');

        });

        it('should fail requests without Bearer authorization header', async () => {
            const res = await chai.request(app)
                .get('/')
                .set('Authorization', 'does not start with bearer');

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.message).to.equal('Wrong authorization header scheme');
        });

        it('should fail on invalid tokens', async () => {
            const res = await chai.request(app)
                .get('/')
                .set('Authorization', 'Bearer token');

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.message).to.equal('invalid token');
            expect(res.body.reason).to.equal('malformed');
        });

        it('should fail on expired tokens', async () => {
            const res = await chai.request(app)
                .get('/')
                .set('Authorization', `Bearer ${generateExpiredToken()}`);

            expect(res).to.have.status(401);
            expect(res).to.be.json;
            expect(res.body.message).to.equal('invalid token');
            expect(res.body.reason).to.equal('expired');
        });

        it('should succeed on valid tokens', async () => {
            const res = await chai.request(app)
                .get('/')
                .set('Authorization', `Bearer ${generateValidToken()}`);

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.success).to.be.true;
        })
    });

    describe('isAuthenticated(false)', () => {
        let app;
        before(() => {
            app = express();
            app.get('/', isAuthenticated(false), (req, res) => {
                res.json({success: true});
            });
        });

        it('should succeed on no token', async () => {
            const res = await chai.request(app)
                .get('/');

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.success).to.be.true;
        });

        it('should fail on token', async () => {
            const res = await chai.request(app)
                .get('/')
                .set('Authorization', `Bearer ${generateValidToken()}`);

            expect(res).to.have.status(403);
            expect(res).to.be.json;
            expect(res.body.message).to.equal('You need to be logged out');
        })
    });
});

function generateExpiredToken() {
    return jwt.sign({}, Buffer.from(process.env.JWT_KEY, 'base64'), {
        expiresIn: '-1h'
    });
}

function generateValidToken() {
    return jwt.sign({}, Buffer.from(process.env.JWT_KEY, 'base64'), {
        expiresIn: '2d'
    });
}