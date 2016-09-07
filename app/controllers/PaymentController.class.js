'use strict';

let imports = {
    'httpStatusCodes' : require('http-status-codes'),
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

    render(res) {
        return res.render('payment-form.twig', {
            'months' : this.months,
            'years' : this.years,
            'formValues' : this.formValues,
            'formErrors' : this.formErrors,
        });
    }

    paymentForm(req, res) {
        let order = this.getOrderDetails(req);
        if (!order) {
            return res.redirect('/order-form');
        }

        // pre-select the date
        this.formValues['expire_month'] = this.months[0];
        this.formValues['expire_year'] = this.years[0];

        return this.render(res);
    }

    getOrderDetails(req) {
        // validate the orderId
        let orderId = parseInt(req.query.orderId) || 0;
        if (!orderId) {
            return null;
        }

        if (!req.session.orderIds || req.session.orderIds.indexOf(orderId) < 0) {
            return null;
        }

        // get the order
        return {
            'id' : orderId,
            'amount' : 10
        }
    }

    paymentFormSubmit(req, res) {
        let order = this.getOrderDetails(req);
        if (!order) {
            return res.redirect('/order-form');
        }

        // valudate the form data
        let postValues = req.body;

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
            this.formValues['number'] = number;
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

        let cvv = parseInt(postValues.cvv);
        if (cvv == '') {
            this.formErrors['cvv'] = 'Please enter a valid CVV';
        } else {
            this.formValues['cvv'] = cvv;
        }

        if (Object.keys(this.formErrors).length) {
            return this.render(res);
        }

        let paymentDetails = new imports.PaymentDetails({
            'amount' : 10,
            'name' : this.formValues['name'],
            'number' : this.formValues['number'],
            'expire_month' : this.formValues['expire_month'],
            'expire_year' : this.formValues['expire_year'],
            'cvv' : this.formValues['cvv'],
        });

        //send the payment
        imports.services.gateway().pay(paymentDetails, (err, response) => {
            if (err) {
                //return res.redirect('/payment-finalized?success=1');
                return res.send(err);
            }
            return res.redirect('/payment-finalized?success=1');
        });
    }
}
