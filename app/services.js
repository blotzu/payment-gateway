'use strict';

let serviceMap = {};

let services = {
    getService : function(name, callback) {
        if (name in serviceMap) {
            return serviceMap[name];
        }
        return callback();
    },
    'config' : function() {
        return require('../config/config.js');
    },
    'gateway' : function() {
        return this.getService(this.name, () => {
            let _class = require(__commonPath + '/lib/PaymentGateway.class.js');
            let gateway = new _class();

            // add payment plugins
            gateway.addClientPlugin(services.paymentPluginPaypal());
            gateway.addClientPlugin(services.paymentPluginBraintree());
            return gateway;
        });
    },

    /**
     * Braintree services
     */
    'gatewayBraintree' : function() {
        let braintree = require("braintree");
        let config = services.config()['gateway']['braintree'];
        return braintree.connect({
            environment: braintree.Environment.Sandbox,
            merchantId: config['merchantId'],
            publicKey: config['publicKey'],
            privateKey: config['privateKey'],
        });
    },

    'clientBraintree' : function() {
        return this.getService(this.name, () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Client/ClientBraintree.class.js');
            return new _class({
                'gateway' : services.gatewayBraintree()
            });
        });
    },

    'paymentPluginBraintree' : function() {
        return this.getService(this.name, () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Plugin/PluginBraintree.class.js');
            return new _class({
                'client' : services.clientBraintree()
            });
        });
    },

    /**
     * Paypal services
     */
    'gatewayPaypal' : function() {
        let paypal = require("paypal-rest-sdk");
        paypal.configure(services.config()['gateway']['paypal']);
        return paypal;
    },

    'clientPaypal' : function() {
        return this.getService(this.name, () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Client/ClientPaypal.class.js');
            return new _class({
                'gateway' : services.gatewayPaypal()
            });
        });
    },

    'paymentPluginPaypal' : function() {
        return this.getService(this.name, () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Plugin/PluginPaypal.class.js');
            return new _class({
                'client' : services.clientPaypal()
            });
        });
    },
};

module.exports = services;