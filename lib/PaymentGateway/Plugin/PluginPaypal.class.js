'use strict';

let imports = {
    'PluginAbstract' : require(__commonPath + '/lib/PaymentGateway/Plugin/PluginAbstract.class.js')
};

module.exports = class PluginPaypal extends imports.PluginAbstract {
    constructor(args) {
        super(args);

        this.currencies = args.currencies || [];
    }

    getClientName() {
        return 'paypal';
    }

    /**
     * Returns the cost of using this gateway to process the payment
     */
    validate(paymentDetails) {
        let cardType = paymentDetails.getCardType();
        if (!this.client.supportsCardType(cardType)) {
            console.log(`Card type ${cardType} not supported`);
            return false;
        }

        if (paymentDetails.isAmex()) {
            console.log(`Card is AMEX`);
            return true;
        }

        if (this.currencies.indexOf(paymentDetails.getCurrency()) >= 0) {
            console.log(`Currency is allowed`);
            return true;
        }

        return false;
    }
}
