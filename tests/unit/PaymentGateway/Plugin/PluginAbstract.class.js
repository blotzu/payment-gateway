'use strict';

require('../../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
    'PluginAbstract' : require(__commonPath + '/lib/PaymentGateway/Plugin/PluginAbstract.class.js'),
};

describe('PluginAbstract', function() {
    let client = {};

    describe('getClientName', function() {
        it('should throw an exception', function(done) {
            let plugin = new imports.PluginAbstract({
                'client' : client,
            });
            try{
                plugin.getClientName();
                imports.should(false).equal(true);
            }catch(e){
                imports.should(e).be.an.instanceOf(Error);
            }
            done();
        });
    });

    describe('validate', function() {
        it('should throw an exception', function(done) {
            let plugin = new imports.PluginAbstract({
                'client' : client,
            });
            try{
                plugin.validate();
                imports.should(false).equal(true);
            }catch(e){
                imports.should(e).be.an.instanceOf(Error);
            }
            done();
        });
    });

    describe('getClient', function() {
        it('should return the client', function(done) {
            let plugin = new imports.PluginAbstract({
                'client' : client,
            });
            imports.should(plugin.getClient()).eql(client);
            done();
        });
    });
});
