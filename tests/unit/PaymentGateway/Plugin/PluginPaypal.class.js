'use strict';

require('../../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
    'PluginPaypal' : require(__commonPath + '/lib/PaymentGateway/Plugin/PluginPaypal.class.js'),
};

describe('PluginPaypal', function() {
    let client;

    beforeEach(function() {
        client = {};
    });

    describe('getClientName', function() {
        it('should be a string', function(done) {
            let plugin = new imports.PluginPaypal({
                'client' : client,
            });
            imports.should(plugin.getClientName()).be.String;
            done();
        });
    });

    describe('validate', function() {
        let details = new imports.PaymentDetails();

        it('should return false for invalid card types', function(done) {
            client.supportsCardType = function() { return false; }

            let plugin = new imports.PluginPaypal({
                'client' : client,
            });
            imports.should(plugin.validate(details)).eql(false);
            done();
        });

        it('should return true for amex cards', function(done) {
            client.supportsCardType = function() { return true; }
            details.isAmex = function() { return true; }

            let plugin = new imports.PluginPaypal({
                'client' : client,
            });
            imports.should(plugin.validate(details)).eql(true);
            done();
        });

        it('should return true for allowed currencies', function(done) {
            client.supportsCardType = function() { return true; }
            details.getCurrency = function() { return "USD"; }

            let plugin = new imports.PluginPaypal({
                'client' : client,
            });
            imports.should(plugin.validate(details)).eql(true);
            done();
        });

        it('should return false for not allowed currencies', function(done) {
            client.supportsCardType = function() { return true; }
            details.getCurrency = function() { return "some other currency"; }

            let plugin = new imports.PluginPaypal({
                'client' : client,
            });
            imports.should(plugin.validate(details)).eql(true);
            done();
        });
    });
});
