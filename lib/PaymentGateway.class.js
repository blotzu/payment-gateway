'use strict';

module.exports = class PaymentGateway {
    constructor() {
        this.clientPlugins = [];
        this.clientPluginNames = {};
    }

    addClientPlugin(clientPlugin) {
        let clientName = clientPlugin.getClientName();
        if (this.hasClientPlugin(clientPlugin)) {
            throw new Error(`Client plugin ${clientName} already defined`);
        }

        this.clientPlugins.push(clientPlugin);
        this.clientPluginNames[clientName] = this.clientPlugins.length;
    }

    removeClientPlugin(clientPlugin) {
        let clientName = clientPlugin.getClientName();
        if (!this.hasClientPlugin(clientPlugin)) {
            throw new Error(`Client plugin ${clientName} not found`);
        }
        let index = this.clientPluginNames[clientName];
        this.clientPlugins.splice(index, 1);

        delete this.clientPluginNames[clientName];
    }

    hasClientPlugin(clientPlugin) {
        return clientPlugin.getClientName() in this.clientPluginNames ? true : false;
    }

    /**
     * Implement the payment gateway interface
     */
    pay(paymentDetails, callback) {
        for (let i=0; i<this.clientPlugins.length; i++) {
            if (!this.clientPlugins[i].validate(paymentDetails)) {
                continue;
            }

            // TODO: if more clients are added, a weighing systems can be added to select the best payment gateway ( cheapest, etc )
            // Currently we just choose the first one that matches
            console.log(`Matched ${this.clientPlugins[i].getClientName()}`);

            return this.clientPlugins[i].getClient().pay(paymentDetails, callback);
        }

        return setImmediate(() => callback('No payment clients defined'));
    }
}
