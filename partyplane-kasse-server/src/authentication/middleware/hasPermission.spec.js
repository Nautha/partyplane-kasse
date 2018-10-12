const express = require('express');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));
const expect = chai.expect;

const {hasPermission} = require('./hasPermission');
const {ServiceLocator} = require('../../serviceLocator/ServiceLocator');

describe('hasPermission middleware', () => {
    it('should fail on missing permission', async () => {
        const app = express();
        const sl = new ServiceLocator();
        sl.register('PermissionRepository', {
            userHasPermission: () => false
        });
        app.locals.serviceLocator = sl;
        app.get('/',
            (req, res, next) => {
                req.user = {_id: 1};
                next();
            },
            hasPermission('test.examplepermission'),
            (req, res) => res.json({success: true})
        );

        const res = await chai.request(app)
            .get('/');

        expect(res).to.have.status(403);
        expect(res).to.be.json;
        expect(res.body.message).to.equal('No Authorization');
    });

    it('shoud succeed on user with permission', async () => {
        const app = express();
        const sl = new ServiceLocator();
        sl.register('PermissionRepository', {
            userHasPermission: () => true
        });
        app.locals.serviceLocator = sl;
        app.get('/',
            (req, res, next) => {
                req.user = {_id: 1};
                next();
            },
            hasPermission('test.examplepermission'),
            (req, res) => res.json({success: true})
        );

        const res = await chai.request(app)
            .get('/');

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.success).to.be.true;
    })
});