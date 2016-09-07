'use strict';

let imports = {
    'PluginAbstract' : require(__commonPath + '/lib/PaymentGateway/Plugin/PluginAbstract.class.js')
};

module.exports = class PluginPaypal extends PluginAbstract {
    getClientName() {
        return 'paypal';
    }

    /**
     * Returns the cost of using this gateway to process the payment
     */
    getTransactionCost(paymentDetails) {
        let cardType = aymentDetails.getCardType();
        if (!this.client.supportsCardType(cardType)) {
            return false;
        }

        if (paymentDetails.isAmex()) {
            return true;
        }

        if (['USD', 'EUR', 'AUD'].indexOf(paymentDetails.getCurrency())) {
            return true;
        }

        return false;
    }
}
