'use strict';

require('./app/bootstrap.js');

let imports = {
    'twig' : require("twig"),
    'express' : require('express'),
    'bodyParser' : require('body-parser'),
    'cookieParser' : require('cookie-parser'),
    'expressSession' : require('express-session'),
    'services' : require(__commonPath + '/app/services.js'),
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

// add the routes
require(__commonPath + '/app/routes.js')(app);

app.listen(imports.services.config()['app']['port'], () => {
    console.log(`App up on port: ${imports.services.config()['app']['port']}!`);
});

module.exports = app;
