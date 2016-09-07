'use strict';

module.exports = class PluginPaypal {
    constructor(args) {
    }

    getClientName() {
        return 'paypal';
    }

    validate(paymentDetails) {
        return false;
    }

    getClient() {
        return null;
    }
}
