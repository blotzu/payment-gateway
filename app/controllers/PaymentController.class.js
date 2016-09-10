'use strict';

let imports = {
    'trim' : require('trim'),
    'BaseController' : require(__commonPath + '/lib/BaseController.class.js'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),

    'services' : require(__commonPath + '/app/services.js'),
};

module.exports = class PaymentContoller extends imports.BaseController {
    constructor(app) {
        super(app);

        this.months = [];
        for (let i=1; i<=12; i++) {
            this.months.push(i < 10 ? '0' + i : i);
        }

        this.years = [];
        let nextYears = 10;
        let currentYear = (new Date()).getFullYear();
        let maxYear = currentYear + nextYears;
        for (let i=currentYear; i<=maxYear; i++) {
            this.years.push(i.toString());
        }

        this.formValues = {};
        this.formErrors = {};
    }

    getFormValues() {
        return this.formValues;
    }

    getFormErrors() {
        return this.formErrors;
    }

    render(res) {
        return res.render('payment-form.twig', {
            'months' : this.months,
            'years' : this.years,
            'formValues' : this.formValues,
            'formErrors' : this.formErrors,
        });
    }

    getOrderDetails(req, callback) {
        // validate the orderId
        let orderId = parseInt(req.query.orderId) || 0;
        if (!orderId) {
            console.log("Missing order id");
            return setImmediate(() => callback());
        }

        if (!req.session.orderIds || req.session.orderIds.indexOf(orderId) < 0) {
            console.log(`Order ${orderId} does not belong to this user`);
            return setImmediate(() => callback());
        }

        return imports.services.orderRepository()
            .findById(orderId)
            .then((order) => {
                if (!order) {
                    return callback(`Could not find order`);
                }
                return callback(null, order);
            })
            .catch((err) => {
                console.log(`Could not get order details`);
                console.log(err);
                return callback(err);
            });
    }

    paymentForm(req, res) {
        this.getOrderDetails(req, (err, order) => {
            if (err || !order) {
                return res.redirect('/order-form');
            }

            // pre-select the date
            this.formValues['expire_month'] = this.months[0];
            this.formValues['expire_year'] = this.years[0];

            return this.render(res);
        });
    }

    paymentFormSubmit(req, res) {
        this.getOrderDetails(req, (err, order) => {
            if (err || !order) {
                return res.redirect('/order-form');
            }

            return this.processPaymentForm(req, res, order);
        });
    }

    processPaymentForm(req, res, order) {
        // validate the form data
        this.validatePostValues(req.body);

        if (Object.keys(this.formErrors).length) {
            return this.render(res);
        }

        let paymentDetails = new imports.PaymentDetails({
            'amount' : order['price'],
            'currency' : order['currency'],
            'name' : this.formValues['name'],
            'number' : this.formValues['number'],
            'expire_month' : this.formValues['expire_month'],
            'expire_year' : this.formValues['expire_year'],
            'cvv' : this.formValues['cvv'],
        });

        //send the payment
        imports.services.gateway().pay(
            paymentDetails,
            (err, gatewayResponse) => this.processGatewayResponse(res, order, err, gatewayResponse)
        );
    }

    validatePostValues(postValues) {
        let name = imports.trim(postValues.name || '');
        if (name == '') {
            this.formErrors['name'] = 'Please enter a valid name';
        } else {
            this.formValues['name'] = name;
        }

        let number = parseInt(postValues.number) || 0;
        if (number <= 0) {
            this.formErrors['number'] = 'Please enter a valid card number';
        } else {
            this.formValues['number'] = String(postValues.number).replace(/[^0-9]+/g, '');
        }

        let expire_month = postValues.expire_month;
        if (this.months.indexOf(expire_month) < 0) {
            this.formErrors['expiration'] = 'Please enter a valid expiration date';
        } else {
            this.formValues['expire_month'] = expire_month;
        }

        let expire_year = postValues.expire_year;
        if (this.years.indexOf(expire_year) < 0) {
            this.formErrors['expiration'] = 'Please enter a valid expiration date';
        } else {
            this.formValues['expire_year'] = expire_year;
        }

        let cvv = parseInt(postValues.cvv) || 0;
        if (cvv <= 0) {
            this.formErrors['cvv'] = 'Please enter a valid CVV';
        } else {
            this.formValues['cvv'] = cvv;
        }
    }

    processGatewayResponse(res, order, err, gatewayResponse) {
        // there usually is a response from the gateway even if there is an error
        if (gatewayResponse) {
            imports.services.transactionRepository()
                .create(order['id'], gatewayResponse)
                .then((transactionId) => {
                    if (err) {
                        return this.returnPaymentError(res, err);
                    }
                    return this.returnPaymentSuccess(res, err);
                })
                .catch((err) => {
                    return this.returnPaymentError(res, err);
                });
        } else {
            if (err) {
                return this.returnPaymentError(res, err);
            } else {
                return this.returnPaymentSuccess(res, err);
            }
        }
    }

    returnPaymentError(res, err) {
        return res.redirect('/payment-finalized?error='+err);
    }

    returnPaymentSuccess(res) {
        return res.redirect('/payment-finalized?success=1');
    }

    paymentFinalized(req, res) {
        return res.render('payment-finalized.twig', {
            'errors' : 'error' in req.query ? req.query.error.split("\n") : [],
            'success' : req.query.success === '1' ? true : false
        });
    }
}
