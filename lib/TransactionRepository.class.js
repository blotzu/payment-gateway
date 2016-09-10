'use strict';

let imports = {
    'BaseRepository' : require(__commonPath + '/lib/BaseRepository.class.js')
};

module.exports = class TransactionRepository extends imports.BaseRepository {
    /**
     * Creates a new transaction
     *
     * @returns promise
     */
    create(orderId, gatewayResponse) {
        return this.db(this.tableName)
            .insert({
                'order_id' : orderId,
                'gateway_response' : JSON.stringify(gatewayResponse),
            })
            .returning('id')
            .then((values) => {
                return values[0];
            });
    }

    /**
     * Returns a transaction by id
     *
     * @returns promise
     */
    findById(id) {
        return this.db(this.tableName)
            .select(['id', 'order_id', 'gateway_response'])
            .where('id', '=', id)
            .then((transactions) => {
                if (transactions.length) {
                    return transactions[0];
                }
                return null;
            })
        ;
    }
}