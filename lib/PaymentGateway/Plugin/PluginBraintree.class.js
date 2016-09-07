'use strict';

module.exports = class PluginBraintree {
    constructor(args) {
        this.client = args.client || null;

        if (!this.client) {
            throw new Error('Missing mandatory argument "client"');
        }
    }

    getClientName() {
        return 'braintree';
    }

    validate(paymentDetails) {
        return true;
    }

    getClient() {
        return this.client;
    }
}
