'use strict';

let imports = {
    'PluginAbstract' : require(__commonPath + '/lib/PaymentGateway/Plugin/PluginAbstract.class.js')
};

module.exports = class PluginBraintree extends imports.PluginAbstract  {
    getClientName() {
        return 'braintree';
    }

    /**
     * Returns true if the payment should be done using this gateway
     * Default client = supports all types of transactions
     */
    validate(paymentDetails) {
        return true;
    }
}
