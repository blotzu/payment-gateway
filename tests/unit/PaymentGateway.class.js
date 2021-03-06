'use strict';

require('../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
    'PaymentGateway' : require(__commonPath + '/lib/PaymentGateway.class.js'),
};

describe('PaymentGateway', function() {
    describe('addClientPlugin', function() {
        it('should not allow a client to be added twice', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let client = {
                'getClientName' : function() { return 'some name'; }
            };

            gateway.addClientPlugin(client);

            try{
                gateway.addClientPlugin(client);
                imports.should(false).equal(true);
            }catch(e){
                imports.should(e).be.an.instanceOf(Error);
            }
            done();
        });
    });

    describe('removeClientPlugin', function() {
        it('should not allow a non-existent client to be removed', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let client = {
                'getClientName' : function() { return 'some name'; }
            };

            try{
                gateway.addClientPlugin(client);
                imports.should(false).equal(true);
            }catch(e){
                imports.should(e).be.an.instanceOf(Error);
            }
            done();
        });
    });

    describe('hasClientPlugin', function() {
        it('should return false if a client exists', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let client = {
                'getClientName' : function() { return 'some name'; }
            };

            imports.should(gateway.hasClientPlugin(client)).eql(false);
            done();
        });

        it('should return true if a client exists', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let client = {
                'getClientName' : function() { return 'some name'; }
            };

            gateway.addClientPlugin(client);

            imports.should(gateway.hasClientPlugin(client)).eql(true);
            done();
        });
    });

    describe('pay', function() {
        it('should not allow invalid card / currency combinations', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let details = new imports.PaymentDetails();
            details.isAmex = function() { return true; }
            details.getCurrency = function() { return 'AUD'; }

            gateway.pay(details, (err, response) => {
                imports.should(err).not.be.String;
                done();
            });
        });

        it('should return an error if no plugins exist', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let details = new imports.PaymentDetails();

            gateway.pay(details, (err, response) => {
                imports.should(err).not.be.String;
                done();
            });
        });

        it('should return an error if no plugins can handle the payment', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let details = new imports.PaymentDetails();
            let client = {
                'getClientName' : function() { return 'some name'; },
                'validate' : function() { return false; }
            };
            gateway.addClientPlugin(client);

            gateway.pay(details, (err, response) => {
                imports.should(err).not.be.String;
                done();
            });
        });

        it('should choose the first plugin that can validate the payment', function(done) {
            let gateway = new imports.PaymentGateway({
                'amexCurrency' : 'USD'
            });
            let details = new imports.PaymentDetails();
            let pay1 = imports.sinon.spy(function() {});
            let client1 = {
                'getClientName' : function() { return 'some name'; },
                'getClient' : function() {
                    return {'pay' : pay1};
                },
                'validate' : function() { return true; },
            };

            let pay2 = imports.sinon.spy(function() {});
            let client2 = {
                'getClientName' : function() { return 'some other name'; },
                'validate' : function() { return true; },
                'getClient' : function() {
                    return {'pay' : pay2};
                },
            };

            // add them in reverse order
            gateway.addClientPlugin(client2);
            gateway.addClientPlugin(client1);

            gateway.pay(details);

            pay1.callCount.should.eql(0);
            pay2.callCount.should.eql(1);

            done();
        });
    });
});
