'use strict';

module.exports = class ClientBraintree {
    constructor(args) {
        this.gateway = args.gateway || null;
        this.merchantAccounts = args.merchantAccounts || {};

        if (!this.gateway) {
            throw new Error('Missing mandatory argument "gateway"');
        }
    }

    getMerchantAccountId(currency) {
        return this.merchantAccounts[currency] || null;
    }

    pay(paymentDetails, callback) {
        return this.gateway.transaction.sale({
            "amount": String(paymentDetails.getAmount()),
            "merchant_account_id" : this.getMerchantAccountId(String(paymentDetails.getCurrency())),
            "creditCard": {
                "number" : String(paymentDetails.getCardNumber()),
                "expirationMonth" : String(paymentDetails.getExpirationMonth()),
                "expirationYear" : String(paymentDetails.getExpirationYear()),
                "cvv" : String(paymentDetails.getCvv()),
            }
        }, (err, transactionResult) => {
            if (err) {
                console.log(`Transaction sale error`);
                console.log(err);
                return callback('Could not process the payment');
            }
            if (!transactionResult.success) {
                return callback(transactionResult.message, transactionResult);
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
                return callback(settleResult.message, settleResult);
            } else {
                return callback(null, settleResult);
            }
        });
    }
}
