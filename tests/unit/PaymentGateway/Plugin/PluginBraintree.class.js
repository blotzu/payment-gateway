'use strict';

require('../../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
    'PluginBraintree' : require(__commonPath + '/lib/PaymentGateway/Plugin/PluginBraintree.class.js'),
};

describe('PluginBraintree', function() {
    let client = {};

    describe('getClientName', function() {
        it('should be a string', function(done) {
            let plugin = new imports.PluginBraintree({
                'client' : client,
            });
            imports.should(plugin.getClientName()).be.String;
            done();
        });
    });

    describe('validate', function() {
        it('should be true', function(done) {
            let plugin = new imports.PluginBraintree({
                'client' : client,
            });
            imports.should(plugin.validate(new imports.PaymentDetails())).eql(true);
            done();
        });
    });
});
