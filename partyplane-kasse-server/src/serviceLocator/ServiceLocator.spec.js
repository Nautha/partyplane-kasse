const chai = require('chai');
chai.use(require('chai-as-promised'));

const expect = chai.expect;

const {ServiceLocator, ServiceNotFound} = require('./ServiceLocator');

describe('ServiceLocator', () => {
   it('should instantiate', () => {
       const sl = new ServiceLocator();
       expect(sl).to.be.ok;
   });

   it('should return the same service as was given in', () => {
        const sl = new ServiceLocator();
        const exampleService = {
            getFoo() {
                return 'Foo';
            }
        };

        sl.register('ExampleService', exampleService);

        const returned = sl.get('ExampleService');

        expect(returned).to.equal(exampleService);
   });

   it('should throw an ServiceNotFound exception on missing key', () => {
        const sl = new ServiceLocator();
        expect(() => sl.get('unknown')).to.throw(ServiceNotFound, 'Service unknown could not be located');
   });

});