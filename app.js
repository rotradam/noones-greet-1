const express = require('express');
const { createNoonesApiWrapper } = require('./src/api');
const { getConfig } = require('./src/config');
const webhooks = require('./src/webhooks');

const config = getConfig();
const noonesApi = createNoonesApiWrapper(config.noonesClientId, config.noonesClientSecret);


const app = express();
app.use(async (req, res, next) => {
    req.context = {
        services: {
            noonesApi: noonesApi
        },
        config: config
    };

    next();
});
// Savings original raw body, needed for Paxful webhook signature checking
app.use(function(req, res, next) {
    req.rawBody = '';

    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    next();
});
app.use(express.json());
app.use('/', require('./src/routes'));
app.listen(config.serverPort, async () => {
    console.debug(`App listening at http://localhost:${config.serverPort}`);
});