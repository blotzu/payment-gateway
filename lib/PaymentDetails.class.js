'use strict';

module.exports = class PaymentDetails {
    static get CARD_TYPE_AMEX() { return 'AMEX';}
    static get CARD_TYPE_DINERSCLUB() { return 'DINERS_CLUB'; }
    static get CARD_TYPE_DISCOVER() { return 'DISCOVER'; }
    static get CARD_TYPE_ENROUTE() { return 'ENROUTE'; }
    static get CARD_TYPE_JBC() { return 'JBC'; }
    static get CARD_TYPE_MASTERCARD() { return 'MASTERCARD'; }
    static get CARD_TYPE_VISA() { return 'VISA'; }

    constructor(data) {
        this.setData(data);
    }

    setData(data) {
        this.data = data || {};
        this.cardType = this.determineCardType();
    }

    getAmount() {
        return this.data.amount || null;
    }

    getCurrency() {
        return this.data.currency || null;
    }

    getCustomerName() {
        return this.data.name || null;
    }

    getCardNumber() {
        return this.data.number || null;
    }

    getExpirationMonth() {
        return this.data.expire_month || null;
    }

    getExpirationYear() {
        return this.data.expire_year || null;
    }

    getCvv() {
        return this.data.cvv || null;
    }

    getCardType() {
        return this.cardType || null;
    }

    isAmex() {
        return this.getCardType() === module.exports.CARD_TYPE_AMEX ? true : false;
    }

    determineCardType() {
        let number = this.getCardNumber();
        if (!number) {
            return null;
        }

        number = String(number);

        // amex
        if (number.length == 15) {
            if (parseInt(number[0]) === 3 && [4, 7].indexOf(parseInt(number[1])) >= 0) {
                return module.exports.CARD_TYPE_AMEX;
            }
        }

        // diners club
        if (number.length == 14) {
            if (parseInt(number[0]) === 3 && [0,6,8].indexOf(parseInt(number[1])) >= 0) {
                return module.exports.CARD_TYPE_DINERSCLUB;
            }
        }

        // discover
        if (number.length == 16) {
            let firstDigits = parseInt(number.substr(0, 8));
            let discoverDigits = [
                [60110000, 60119999],
                [65000000, 65999999],
                [62212600, 62292599]
            ];

            for (let digitRange of discoverDigits) {
                if (firstDigits >= digitRange[0] && firstDigits <= digitRange[1]) {
                    return module.exports.CARD_TYPE_DISCOVER;
                }
            }
        }

        // enRoute
        if (number.length == 15) {
            let firstDigits = parseInt(number.substr(0, 4));
            if ([2014, 2149].indexOf(firstDigits) >= 0) {
                return module.exports.CARD_TYPE_ENROUTE;
            }
        }

        // jbc
        if (number.length == 16) {
            if ([3088, 3096, 3112, 3158, 3337].indexOf(parseInt(number.substr(0, 4))) >= 0) {
                return module.exports.CARD_TYPE_JBC;
            }
            let firstDigits = parseInt(number.substr(0, 8));
            if (firstDigits >= 35280000 && firstDigits <=35899999)  {
                return module.exports.CARD_TYPE_JBC;
            }
        }

        // master card
        if (number.length == 16) {
            if (parseInt(number[0]) === 5) {
                let nextDigit = parseInt(number[1]);
                if (nextDigit >= 1 && nextDigit <= 5) {
                    return module.exports.CARD_TYPE_MASTERCARD;
                }
            }
        }

        // visa
        if (number.length == 16 || number.length == 13) {
            if (parseInt(number[0]) === 4) {
                return module.exports.CARD_TYPE_VISA;
            }
        }

        return null;
    }
}
