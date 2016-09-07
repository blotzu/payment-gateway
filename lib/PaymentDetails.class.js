'use strict';

module.exports = class PaymentDetails {
    constructor(data) {
        this.setData(data);
    }

    setData(data) {
        this.data = data || {};
    }

    getAmount() {
        return this.data.amount || null;
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
        return this.data.cvv || 'null';
    }
}
