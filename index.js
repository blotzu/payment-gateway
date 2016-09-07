'use strict';

require('./app/bootstrap.js');

let imports = {
    'twig' : require("twig"),
    'express' : require('express'),
    'bodyParser' : require('body-parser'),
    'cookieParser' : require('cookie-parser'),
    'expressSession' : require('express-session'),
    'services' : require(__commonPath + '/app/services.js'),

    'OrderContoller' : require(__commonPath + '/app/controllers/OrderContoller.class.js'),
    'PaymentController' : require(__commonPath + '/app/controllers/PaymentController.class.js'),
};

let app = imports.express();

// bind the service container to the app
app.services = imports.services;

// set up templating
app.set('views', __commonPath + '/views');

// set up static files
app.use(imports.express.static('public'));
app.use(imports.bodyParser.urlencoded({ extended: false }));
app.use(imports.cookieParser());
app.use(imports.expressSession(app.services.config()['app']['session']));

// define the routes
app.get('/order-form', (req, res) => {
    let controller = new imports.OrderContoller(app);
    return controller.orderForm(req, res);
});
app.post('/order-form', (req, res) => {
    let controller = new imports.OrderContoller(app);
    return controller.orderFormSubmit(req, res);
});

app.get('/payment-form', (req, res) => {
    let controller = new imports.PaymentController(app);
    return controller.paymentForm(req, res);
});
app.post('/payment-form', (req, res) => {
    let controller = new imports.PaymentController(app);
    return controller.paymentFormSubmit(req, res);
});

app.listen(imports.services.config()['app']['port'], () => {
    console.log(`App up on port: ${imports.services.config()['app']['port']}!`);
});

module.exports = app;
