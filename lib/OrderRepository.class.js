'use strict';

let imports = {
    'BaseRepository' : require(__commonPath + '/lib/BaseRepository.class.js')
};

module.exports = class OrderRepository extends imports.BaseRepository {
    /**
     * Creates a new order
     *
     * @returns promise
     */
    create(price, currency, customerName) {
        return this.db(this.tableName)
            .insert({
                'price' : price,
                'currency' : currency,
                'customer_name' : customerName,
            })
            .returning('id')
            .then((values) => {
                return values[0];
            });
    }

    /**
     * Returns an order by id
     *
     * @returns promise
     */
    findById(id) {
        return this.db(this.tableName)
            .select(['id', 'price', 'currency', 'customer_name'])
            .where('id', '=', id)
            .then((orders) => {
                if (orders.length) {
                    return orders[0];
                }
                return null;
            })
        ;
    }
}