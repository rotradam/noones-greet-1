const fs = require('fs');
const { createNoonesApi } = require('./noonesApi');


// In real word application you should consider using a database to store
// credentials
const credentialsStorage = {
    // private
    storageFilename: __dirname + '/../storage/credentials.json',

    saveCredentials(credentials) {
        fs.writeFileSync(this.storageFilename, JSON.stringify(credentials));
    },

    getCredentials() {
        return fs.existsSync(this.storageFilename) ? JSON.parse(fs.readFileSync(this.storageFilename)) : null;
    }
};

class NoonesApiFacade {
    constructor(client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    async sendMessage(tradeHash, message) {
        return this.client.invoke('/noones/v1/trade-chat/post', {
            trade_hash: tradeHash,
            message: message
        });
    }

    async getTrade(tradeHash) {
        return this.client.invoke('/noones/v1/trade/get', { trade_hash: tradeHash });
    }
}

module.exports.createNoonesApiWrapper = (clientId, clientSecret) => {
    const client = createNoonesApi(clientId, clientSecret);
    return new NoonesApiFacade(client);
};