const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// const {routes} = require('./routes');
// const {errorHandler} = require('./middleware/error');
const {ServiceLocator, registerServices} = require('./servicelocator/ServiceLocator');
// const {initialisation} = require('./initialization');


(async function() {
    const serviceLocator = new ServiceLocator();
    registerServices(serviceLocator);

    await serviceLocator.get('DatabaseController')._connect();

    // await initialisation(serviceLocator);

    const app = express();

    app.locals.serviceLocator = serviceLocator;

    app.use(bodyParser.json());
    app.use(cors());
    // routes.forEach(route => app.use(route));

    // app.use(errorHandler);
    
    app.listen(8080, () => console.log("\x1b[32m%s\x1b[0m", 'Server started'));
})();