const express = require('express');
const { isValidNoonesSignature, dispatchNoonesWebhook } = require('../webhooks');
const router = express.Router();

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const handlers = {
    'trade.started': async (tradeHash, noonesApi, config) => {
        await sleep(config.messageDelay);
        await noonesApi.sendMessage(tradeHash, config.messageText);
    }
}

// No problem keeping to have it in-memory. Even if process is restarted we can easily rebuild it
const tradeToOfferMap = {};

// Middleware to save the raw request body
router.use((req, res, next) => {
    req.rawBody = '';
    req.on('data', chunk => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        next();
    });
});

router.post('/noones/webhook', async (req, res) => {
    const isValidationRequest = req.body.type === undefined;
    if (isValidationRequest) {
        console.debug("Validation request arrived");

        res.set("X-Noones-Request-Challenge", req.headers['x-noones-request-challenge']);
        res.status(200).end();
        return;
    }

    const signature = req.get('x-noones-signature');
    if (!signature) {
        console.warn("No signature");

        res.json({ "status": "error", "message": "No signature header" });
        res.status(403);
        return;
    }

    if (!isValidNoonesSignature(signature, req.get('host'), req.originalUrl, req.rawBody)) {
        console.warn("Invalid signature");

        res.json({ "status": "error", "message": "Invalid signature" });
        res.status(403);
        return;
    }

    console.debug("\n---------------------")
    console.debug("New incoming webhook:")
    console.debug(req.body)
    console.debug("---------------------")

    try {
        await dispatchNoonesWebhook(tradeToOfferMap, handlers, req);
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false });
    }
});

module.exports = router;
