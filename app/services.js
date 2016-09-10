'use strict';

let serviceMap = {};

let services = {
    getService : function(name, callback) {
        if (name in serviceMap) {
            return serviceMap[name];
        }
        let service = callback();
        serviceMap[name] = service;
    },
    setService : function(name, service) {
        serviceMap[name] = service;
    },
    'config' : function() {
        return require('../config/config.js');
    },

    /**
     * Postgres db client
     */
    'db' : function() {
        return this.getService('db', () => {
            let config = services.config();
            let knex = require('knex')({
                'client': config['db']['client'],
                'connection': config['db']['connection'],
                'pool': config['db']['pool'],
            });

            return knex;
        });
    },
    'orderRepository' : function() {
        return this.getService('orderRepository', () => {
            let _class = require(__commonPath + '/lib/OrderRepository.class.js');
            return new _class(
                services.db(),
                services.config()['entities']['Order']['tableName']
            );
        });
    },
    'transactionRepository' : function() {
        return this.getService('transactionRepository', () => {
            let _class = require(__commonPath + '/lib/TransactionRepository.class.js');
            return new _class(
                services.db(),
                services.config()['entities']['Transaction']['tableName']
            );
        });
    },

    /**
     * Generic payment gateway class
     */
    'gateway' : function() {
        return this.getService('gateway', () => {
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
        return this.getService('gatewayBraintree', () => {
            let braintree = require("braintree");
            let config = services.config()['gateway']['braintree'];
            return braintree.connect({
                environment: braintree.Environment.Sandbox,
                merchantId: config['merchantId'],
                publicKey: config['publicKey'],
                privateKey: config['privateKey'],
            });
        });
    },
    'clientBraintree' : function() {
        return this.getService('clientBraintree', () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Client/ClientBraintree.class.js');
            return new _class({
                'gateway' : services.gatewayBraintree()
            });
        });
    },
    'paymentPluginBraintree' : function() {
        return this.getService('paymentPluginBraintree', () => {
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
        return this.getService('gatewayPaypal', () => {
            let paypal = require("paypal-rest-sdk");
            paypal.configure(services.config()['gateway']['paypal']);
            return paypal;
        });
    },
    'clientPaypal' : function() {
        return this.getService('clientPaypal', () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Client/ClientPaypal.class.js');
            return new _class({
                'gateway' : services.gatewayPaypal()
            });
        });
    },
    'paymentPluginPaypal' : function() {
        return this.getService('paymentPluginPaypal', () => {
            let _class = require(__commonPath + '/lib/PaymentGateway/Plugin/PluginPaypal.class.js');
            return new _class({
                'client' : services.clientPaypal()
            });
        });
    },
};

module.exports = services;