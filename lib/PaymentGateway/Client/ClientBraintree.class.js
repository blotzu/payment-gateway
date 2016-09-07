'use strict';

module.exports = class ClientBraintree {
    constructor(args) {
        this.gateway = args.gateway || null;

        if (!this.gateway) {
            throw new Error('Missing mandatory argument "gateway"');
        }
    }

    getClientName() {
        return 'braintree';
    }

    pay(paymentDetails, callback) {
        return this.gateway.transaction.sale({
            "amount": paymentDetails.getAmount(),
            "creditCard": {
                "number" : paymentDetails.getCardNumber(),
                "expirationMonth" : paymentDetails.getExpirationMonth(),
                "expirationYear" : paymentDetails.getExpirationYear(),
                "cvv" : paymentDetails.getCvv(),
            }
        }, (err, transactionResult) => {
            if (err) {
                console.error(err);
                return callback('Could not process the payment');
            }

            return this.setttlePayment(transactionResult.transaction.id, callback);
        });
    }

    setttlePayment(transactionId, callback) {
        this.gateway.testing.settle(transactionId, (err, settleResult) => {
            if (err) {
                return callback(err);
            }

            if (!settleResult.success) {
                return callback(settleResult.message);
            } else {
                return callback(null, settleResult);
            }
        });
    }
}
