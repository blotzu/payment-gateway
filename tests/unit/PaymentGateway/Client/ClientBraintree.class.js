'use strict';

require('../../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
    'ClientBraintree' : require(__commonPath + '/lib/PaymentGateway/Client/ClientBraintree.class.js'),
};

describe('ClientBraintree', function() {
    describe('pay', function() {

        let details = new imports.PaymentDetails({
            'amount' : 1,
            'number' : 12323,
            'expire_month' : 1,
            'expire_year' : 2000,
            'cvv' : 123
        });

        describe('sale arguments', function() {
            let gateway = {
                'transaction' : {
                    'sale' : imports.sinon.spy(function(data){ return data; })
                },
            };

            it('should call sale', function(done) {
                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });
                client.pay(details);

                gateway.transaction.sale.callCount.should.eql(1);
                done();
            });

            it('should send only string parameters', function(done) {
                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });
                client.pay(details);

                gateway.transaction.sale.calledWith({
                    amount: '1',
                    creditCard: {
                        number: '12323',
                        expirationMonth: '1',
                        expirationYear: '2000',
                        cvv: '123'
                    }
                }).should.eql(true);
                done();
            });
        });

        describe('sale callback', function() {
            let gateway = {
                'transaction' : {
                    'sale' : imports.sinon.spy(function(data, cb){ return cb(data); })
                },
                'testing' : {
                    'settle' : imports.sinon.spy(function(transactionId, cb){ return cb(transactionId); })
                }
            };

            it('should return error on error', function(done) {
                gateway.transaction.sale = imports.sinon.spy(function(data, cb){ return cb('some error'); })

                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });
                client.pay(details, (err, response) => {
                    imports.should(err).not.eql(null);
                    imports.should(err).not.eql(undefined);
                    imports.should(response).eql(undefined);

                    done();
                });
            });

            it('should return the fail message on unsuccessful transactions', function(done) {
                let gatewayResponse = {
                    'success' : false,
                    'message' : 'some failure message'
                };
                gateway.transaction.sale = imports.sinon.spy(function(data, cb){ return cb(null, gatewayResponse); })

                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });
                client.pay(details, (err, response) => {
                    imports.should(err).eql(gatewayResponse.message);
                    imports.should(gatewayResponse).eql(gatewayResponse);

                    done();
                });
            });

            it('should call settle on success', function(done) {
                let gatewayResponse = {
                    'success' : true,
                    'transaction' : {
                        'id' : 123
                    }
                };
                let callback = (err, response) => {
                    imports.should(err).eql();
                    imports.should(gatewayResponse).eql(gatewayResponse);

                    done();
                };
                gateway.transaction.sale = imports.sinon.spy(function(data, cb){ return cb(null, gatewayResponse); });
                gateway.testing.settle = imports.sinon.spy(function(transactionId, cb){ return callback(); });

                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });

                client.pay(details, (transactionId) => {
                    gateway.testing.settle.calledWith(123).should.eql(true);
                });
            });
        });

        describe('settle', function() {
            let gateway = {
                'transaction' : {
                    'sale' : imports.sinon.spy(function(data, cb){ return cb(data); })
                },
                'testing' : {
                    'settle' : imports.sinon.spy(function(transactionId, cb){ return cb(transactionId); })
                }
            };

            it('should return error on error', function(done) {
                gateway.testing.settle = imports.sinon.spy(function(transactionId, cb){ return cb('some error'); })

                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });
                client.setttlePayment(123, (err, response) => {
                    imports.should(err).eql('some error');
                    imports.should(response).eql(undefined);

                    done();
                });
            });

            it('should return the fail message on unsuccessful transactions', function(done) {
                let gatewayResponse = {
                    'success' : false,
                    'message' : 'some failure message'
                };
                gateway.testing.settle = imports.sinon.spy(function(data, cb){ return cb(null, gatewayResponse); })

                let client = new imports.ClientBraintree({
                    'gateway' : gateway,
                });
                client.setttlePayment(details, (err, response) => {
                    imports.should(err).eql(gatewayResponse.message);
                    imports.should(gatewayResponse).eql(gatewayResponse);

                    done();
                });
            });
        });
    });
});