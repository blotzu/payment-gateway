'use strict';

let imports = {
    'OrderController' : require(__commonPath + '/app/controllers/OrderController.class.js'),
    'PaymentController' : require(__commonPath + '/app/controllers/PaymentController.class.js'),
};

module.exports = function(app) {
    // the order form
    app.get('/order-form', (req, res) => {
        let controller = new imports.OrderController(app);
        return controller.orderForm(req, res);
    });
    app.post('/order-form', (req, res) => {
        let controller = new imports.OrderController(app);
        return controller.orderFormSubmit(req, res);
    });

    // the payment form
    app.get('/payment-form', (req, res) => {
        let controller = new imports.PaymentController(app);
        return controller.paymentForm(req, res);
    });
    app.post('/payment-form', (req, res) => {
        let controller = new imports.PaymentController(app);
        return controller.paymentFormSubmit(req, res);
    });

    // post payment
    app.get('/payment-finalized', (req, res) => {
        let controller = new imports.PaymentController(app);
        return controller.paymentFinalized(req, res);
    });
    
}
