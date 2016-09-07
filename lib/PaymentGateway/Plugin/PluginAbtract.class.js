'use strict';

module.exports = class PluginAbstract {
    constructor(args) {
        this.client = args.client || null;

        if (!this.client) {
            throw new Error('Missing mandatory argument "client"');
        }
    }

    /**
     * Returns true unique plugin name
     */
    getClientName() {
        throw new Error(`Method ${this.name} not implemented`);
    }

    /**
     * Returns true if the payment should be done using this gateway
     */
    validate(paymentDetails) {
        throw new Error(`Method ${this.name} not implemented`);
    }

    /**
     * Returns the payment client
     */
    getClient() {
        return this.client;
    }
}
