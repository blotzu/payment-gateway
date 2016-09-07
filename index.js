'use strict';

require('./app/bootstrap.js');

let imports = {
    'express' : require('express'),
    'services' : require(__commonPath + '/app/services.js'),

    'PaymentController' : require(__commonPath + '/app/controllers/PaymentController.class.js'),
};

let app = imports.express();

// bind the service container to the app
app.services = imports.services;

// define the routes
app.get('/payment-form', (req, res) => {
    let controller = new imports.PaymentController(app);
    return controller.paymentForm(req, res);
});

app.listen(imports.services.config()['app']['port'], () => {
    console.log(`App up on port: ${imports.services.config()['app']['port']}!`);
});

module.exports = app;
