const chai = require('chai');
chai.use(require('chai-as-promised'));

const expect = chai.expect;

const {ServiceLocator, registerServices} = require('./ServiceLocator');

describe('registerServices', () => {
    it('should register services', () => {
        const sl = new ServiceLocator();
        expect(sl.services).to.be.empty;
        registerServices(sl);
        expect(sl.services).not.to.be.empty;
    });
});