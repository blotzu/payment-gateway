'use strict';

let imports = {
};

module.exports = class ClientPaypal {
    constructor(args) {
    }

    getClientName() {
        return 'paypal';
    }

    pay(paymentDetails, callback) {
        return setImmediate(() => callback('Could not process the payment'));
    }
}
