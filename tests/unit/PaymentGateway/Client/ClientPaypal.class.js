'use strict';

require('../../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
    'ClientPaypal' : require(__commonPath + '/lib/PaymentGateway/Client/ClientPaypal.class.js'),
};

describe('ClientPaypal', function() {
    describe('supportsCardType', function() {
        let details = new imports.PaymentDetails({
        });
        let gateway = {};

        imports.leche.withData({
            'visa' : [
                imports.PaymentDetails.CARD_TYPE_VISA,
                true
            ],
            'amex' : [
                imports.PaymentDetails.CARD_TYPE_AMEX,
                true
            ],
            'mastercard' : [
                imports.PaymentDetails.CARD_TYPE_MASTERCARD,
                true
            ],
            'discover' : [
                imports.PaymentDetails.CARD_TYPE_DISCOVER,
                true
            ],
            'different' : [
                'something',
                false
            ],
        }, function (cardType, expected) {
            it('should return true on allowed cards', function(done) {
                let client = new imports.ClientPaypal({
                    'gateway' : gateway,
                });
                details.getCardType = function() { return cardType; }

                imports.should(client.supportsCardType(cardType)).eql(expected);

                done();
            });
        });
    });

    describe('pay', function() {
        let details = new imports.PaymentDetails({
            'amount' : 1,
            'currency' : 'USD',
            'number' : '12323',
            'expire_month' : '1',
            'expire_year' : '2000',
            'cvv' : '123'
        });
        // set one allowed card type
        details.getCardType = function() { return imports.PaymentDetails.CARD_TYPE_VISA; }

        describe('create arguments', function() {
            let gateway = {
                'payment' : {
                    'create' : imports.sinon.spy(function(data, cb){ return data; })
                }
            };

            it('should call create', function(done) {
                let client = new imports.ClientPaypal({
                    'gateway' : gateway,
                });
                client.pay(details);

                gateway.payment.create.callCount.should.eql(1);
                done();
            });

            it('should send the correct payload', function(done) {
                let client = new imports.ClientPaypal({
                    'gateway' : gateway,
                });

                client.pay(details);

                gateway.payment.create.calledWith({
                    "intent": "sale",
                    "payer": {
                        "payment_method": "credit_card",
                        "funding_instruments": [{
                            "credit_card": {
                                "type": 'visa',
                                "number": '12323',
                                "expire_month": '1',
                                "expire_year": '2000',
                                "cvv2": '123',
                            }
                        }]
                    },
                    "transactions": [{
                        "amount": {
                            "total": 1,
                            "currency": 'USD'
                        }
                    }]
                }).should.eql(true);
                done();
            });
        });

        describe('sale callback', function() {
            it('should return error on an unknown error', function(done) {
                let gateway = {
                    'payment' : {
                        'create' : imports.sinon.spy(function(data, cb){ return cb('some error'); })
                    }
                };

                let client = new imports.ClientPaypal({
                    'gateway' : gateway,
                });
                client.pay(details, (err, response) => {
                    imports.should(err).not.eql(null);
                    imports.should(err).not.eql(undefined);
                    imports.should(response).eql(undefined);

                    done();
                });
            });

            it('should return the error list error on error', function(done) {
                let error = {
                    'response' : {
                        'details' : [
                            {
                                'issue' : 'some issue'
                            },
                            {
                                'issue' : 'some other issue'
                            },
                        ]
                    }
                };
                let gatewayResponse = {'key' : 'value'};
                let gateway = {
                    'payment' : {
                        'create' : imports.sinon.spy(function(data, cb){ return cb(error, gatewayResponse); })
                    }
                };

                let client = new imports.ClientPaypal({
                    'gateway' : gateway,
                });
                client.pay(details, (err, response) => {
                    imports.should(err).eql('some issue' + "\n" + 'some other issue');
                    imports.should(response).eql(gatewayResponse);
                    done();
                });
            });

            it('should return no error unsuccessful transactions', function(done) {
                let error = null;
                let gatewayResponse = {'key' : 'value'};
                let gateway = {
                    'payment' : {
                        'create' : imports.sinon.spy(function(data, cb){ return cb(error, gatewayResponse); })
                    }
                };

                let client = new imports.ClientPaypal({
                    'gateway' : gateway,
                });
                client.pay(details, (err, response) => {
                    imports.should(err).eql(null);
                    imports.should(response).eql(gatewayResponse);
                    done();
                });
            });
        });
   });
});