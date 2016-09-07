'use strict';

let imports = {
    'httpStatusCodes' : require('http-status-codes'),
    'BaseController' : require(__commonPath + '/lib/BaseController.class.js')
};

module.exports = class PaymentContoller extends imports.BaseController {
    paymentForm(req, res) {
        return res.end();
    }
}
