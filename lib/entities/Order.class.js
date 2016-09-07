'use strict';

module.exports = class Order {

    create(price, currency, name, callback) {
        return setTimeout(() => {
            return callback(null, 1);
        }, 0);
    }
}