'use strict';

let imports = {
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js')
};

module.exports = class ClientPaypal {
    constructor(args) {
        this.gateway = args.gateway || null;

        if (!this.gateway) {
            throw new Error('Missing mandatory argument "gateway"');
        }
    }

    static getCardTypeMap() {
        if (this.cardTypeMap) {
            return this.cardTypeMap;
        }
        // map card type to paypal supported values
        this.cardTypeMap = {};
        this.cardTypeMap[imports.PaymentDetails.CARD_TYPE_VISA] = 'visa';
        this.cardTypeMap[imports.PaymentDetails.CARD_TYPE_AMEX] = 'amex';
        this.cardTypeMap[imports.PaymentDetails.CARD_TYPE_MASTERCARD] = 'mastercard';
        this.cardTypeMap[imports.PaymentDetails.CARD_TYPE_DISCOVER] = 'discover';
        return this.cardTypeMap;
    }

    supportsCardType(cardType) {
        return cardType in module.exports.getCardTypeMap() ? true : false;
    }

    pay(paymentDetails, callback) {
        let cardType = paymentDetails.getCardType();

        if (!(cardType in module.exports.getCardTypeMap())) {
            return callback('Invalid card type')
        }

        let create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card": {
                        "type": module.exports.getCardTypeMap()[cardType],
                        "number": paymentDetails.getCardNumber(),
                        "expire_month": paymentDetails.getExpirationMonth(),
                        "expire_year": paymentDetails.getExpirationYear(),
                        "cvv2": paymentDetails.getCvv(),
                    }
                }]
            },
            "transactions": [{
                "amount": {
                    "total": paymentDetails.getAmount(),
                    "currency": paymentDetails.getCurrency()
                }
            }]
        };
        return this.gateway.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.error(error.response.details);
                console.log(payment);;
                return callback('Could not create payment');
            } else {
                return callback(null, payment);
            }
        });
    }
}
