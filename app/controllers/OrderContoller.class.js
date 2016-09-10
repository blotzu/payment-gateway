'use strict';

let imports = {
    'httpStatusCodes' : require('http-status-codes'),
    'trim' : require('trim'),
    'BaseController' : require(__commonPath + '/lib/BaseController.class.js'),

    'services' : require(__commonPath + '/app/services.js'),
};

module.exports = class OrderContoller extends imports.BaseController {
    constructor(app) {
        super(app);

        this.formErrors = {};
        this.formValues = {};
        this.currencies = imports.services.config()['order']['currencies'];
    }

    orderForm(req, res) {
        return this.render(res);
    }

    orderFormSubmit(req, res) {
        let postValues = req.body;
        let price = parseFloat(postValues.price);
        if (isNaN(price) || price <= 0){
            this.formErrors['price'] = 'Please enter a valid price';
        } else {
            this.formValues['price'] = price;
        }

        let currency = postValues.currency;
        if (this.currencies.indexOf(currency) < 0) {
            this.formErrors['currency'] = 'Please enter a valid currency';
        } else {
            this.formValues['currency'] = currency;
        }

        let name = imports.trim(postValues.name || '');
        if (name == '') {
            this.formErrors['name'] = 'Please enter a valid name';
        } else {
            this.formValues['name'] = name;
        }

        if (Object.keys(this.formErrors).length) {
            return this.render(res);
        }

        // proceed with the order
        imports.services.orderRepository()
            .create(price, currency, name)
            .then((orderId) => {
                // set the order id in the allowed list
                if (!req.session.orderIds) {
                    req.session.orderIds = [];
                }
                req.session.orderIds.push(orderId);

                return res.redirect('/payment-form?orderId='+orderId);
            }).catch((err) => {
                this.formErrors['order'] = 'Could not create order';
                return this.render(res);
            });
    }

    render(res) {
        return res.render('order-form.twig', {
            'formErrors' : this.formErrors,
            'formValues' : this.formValues,
            'currencies' : this.currencies,
        });
    }
}
