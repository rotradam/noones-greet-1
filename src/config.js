const dotenv = require('dotenv');
dotenv.config();

module.exports.getConfig = () => {
    const config = {
        noonesClientId: process.env.NOONES_CLIENT_ID,
        noonesClientSecret: process.env.NOONES_CLIENT_SECRET,
        offerHashes: process.env.OFFER_HASHES,
        messageText: process.env.PAXFUL_AUTOGREETING_MESSAGE,
        messageDelay: parseInt(process.env.PAXFUL_AUTOGREETING_DELAY) || 1000,
        serverPort: process.env.SERVER_PORT || 3000
    }

    if (!config.noonesClientId || !config.noonesClientSecret) {
        const error = [
            'Either "PAXFUL_CLIENT_ID" and/or "PAXFUL_API_SECRET" is not defined.',
            'You can get client id and secret by creating an application on developers portal',
            '(https://developers.paxful.com)'
        ];

        throw new Error(error.join(' '));
    }

    if (!config.messageText) {
        const error = [
            'Environment variable "PAXFUL_AUTOGREETING_MESSAGE" is not defined or empty.',
            'Please set this variable with a message that you would like the bot to send',
            'when a new trade is started upon your offer(s).'
        ];

        throw new Error(error.join(''))
    }

    if (config.offerHashes) {
        config.offerHashes = config.offerHashes.split(',').map(v => v.trim())
    } else {
        const error = [
            'Environment variable "OFFER_HASHES" is not defined.',
            'Please provide hashes of offers that the bot should react to.',
            'You will get an offer hash when you create an offer on paxful.com.',
            'You can pass several offer hashes all separates by a comma, e.g.: SDma7enDCEs,hDmB3enGREm'
        ];

        throw new Error(error.join(' '));
    }

    return config;
}