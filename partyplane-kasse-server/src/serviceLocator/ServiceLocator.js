const {registerServices} = require('./registerServices');

class ServiceNotFound extends Error {
    constructor(serviceKey) {
        super(`Service ${serviceKey} could not be located`);
        this.serviceKey = serviceKey;
    }
}

class ServiceLocator {
    constructor() {
        this.services = new Map();
    }

    register(key, value) {
        this.services.set(key, value);
    }

    get(key) {
        const service = this.services.get(key);
        if(!service) {
            throw new ServiceNotFound(key);
        }
        return service;
    }
}

module.exports = {ServiceLocator, ServiceNotFound, registerServices};