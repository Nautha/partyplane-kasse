const express= require('express');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));

const expect = chai.expect;

const {errorHandler} = require('./error');

describe('Error Middleware', () => {
    let app;
    beforeEach(() => {
        app = express();
    })

    it('should not react on no errors', async () => {
        app.get('/', (req, res) => {
            res.json({
                success: true
            })
        });

        app.use(errorHandler);

        const res = await chai.request(app)
            .get('/');

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.success).to.be.true;
    });

    it('should report an error on error thrown', async () => {
        app.get('/', () => {
            throw new Error('Testerror');
        });

        app.use(errorHandler);

        const res = await chai.request(app)
            .get('/');

        expect(res).to.have.status(500);
        expect(res).to.be.json;
        expect(res.body.message).to.equal('Internal Server Error');
    })

});