const nacl = require('tweetnacl');

// module.exports.isValidSignature = (signature, host, originalUrl, rawBody) => {
//     const message = `https://${host}${originalUrl}:${rawBody}`;
//     return nacl.sign.detached.verify(
//         Buffer.from(message, 'utf8'),
//         Buffer.from(signature, 'base64'),
//         Buffer.from(process.env.WEBHOOK_SIGNATURE_PUBLIC_KEY, 'base64') // TODO consider adding it as a constant?
//     )
// }

module.exports.dispatchWebhook = async (tradesToOfferMapping, handlers, req) => {
    const type = req.body.type;
    if (handlers[type]) {
        try {
            const services = req.context.services;
            const noonesApi = services.noonesApi;

            const th = req.body.payload.trade_hash;
            if (!tradesToOfferMapping[th]) {
                const trade = (await noonesApi.getTrade(th)).data.trade;
                tradesToOfferMapping[th] = trade.offer_hash;
            }

            const offerHash = tradesToOfferMapping[th];
            if (!req.context.config.offerHashes.includes(offerHash)) {
                console.debug(`Skipping handling webhook as it is related to an offer ${offerHash} that bot is not configured to monitor`);
                return;
            }

            await handlers[type](th, noonesApi, req.context.config);
        } catch(e) {
            console.error(`Error when handling '${type}' webhook:`, e);

            throw e;
        }
    }
}