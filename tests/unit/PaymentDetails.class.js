'use strict';

require('../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'PaymentDetails' : require(__commonPath + '/lib/PaymentDetails.class.js'),
};

describe('PaymentDetails', function() {
    describe('getAmount', function() {
        it('should return the expected amount', function(done) {
            let details = new imports.PaymentDetails({
                'amount' : 100,
            });
            imports.should(details.getAmount()).eql(100);
            done();
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getAmount()).eql(null);
            done();
        });
    });

    describe('getCurrency', function() {
        it('should return the expected currency', function(done) {
            let details = new imports.PaymentDetails({
                'currency' : 'some currency',
            });
            imports.should(details.getCurrency()).eql('some currency');
            done();
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getCurrency()).eql(null);
            done();
        });
    });

    describe('getCardNumber', function() {
        it('return the expected number', function(done) {
            let details = new imports.PaymentDetails({
                'number' : 'some number',
            });
            imports.should(details.getCardNumber()).eql('some number');
            done();
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getCardNumber()).eql(null);
            done();
        });
    });

    describe('getExpirationMonth', function() {
        it('return the expected month', function(done) {
            let details = new imports.PaymentDetails({
                'expire_month' : '123',
            });
            imports.should(details.getExpirationMonth()).eql('123');
            done();
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getExpirationMonth()).eql(null);
            done();
        });
    });

    describe('getExpirationYear', function() {
        it('return the expected year', function(done) {
            let details = new imports.PaymentDetails({
                'expire_year' : '456',
            });
            imports.should(details.getExpirationYear()).eql('456');
            done();
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getExpirationYear()).eql(null);
            done();
        });
    });

    describe('getCvv', function() {
        it('return the expected cvv', function(done) {
            let details = new imports.PaymentDetails({
                'cvv' : '456',
            });
            imports.should(details.getCvv()).eql('456');
            done();
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getCvv()).eql(null);
            done();
        });
    });

    describe('getCardType', function() {
        imports.leche.withData({
            'amex - 3 and 4' : [
                {
                    'number' : '340000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_AMEX
            ],
            'amex - 3 and 6' : [
                {
                    'number' : '370000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_AMEX
            ],

            'diners club - 3 and 0' : [
                {
                    'number' : '30000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_DINERSCLUB
            ],
            'diners club - 3 and 6' : [
                {
                    'number' : '36000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_DINERSCLUB
            ],
            'diners club - 3 and 8' : [
                {
                    'number' : '38000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_DINERSCLUB
            ],

            'discover - range 1' : [
                {
                    'number' : '60110001' + '00000000' 
                },
                imports.PaymentDetails.CARD_TYPE_DISCOVER
            ],
            'discover - range 2' : [
                {
                    'number' : '65000001' + '00000000' 
                },
                imports.PaymentDetails.CARD_TYPE_DISCOVER
            ],
            'discover - range 3' : [
                {
                    'number' : '62212601' + '00000000' 
                },
                imports.PaymentDetails.CARD_TYPE_DISCOVER
            ],

            'en route - 2014' : [
                {
                    'number' : '2014' + '00000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_ENROUTE
            ],
            'en route - 2149' : [
                {
                    'number' : '2149' + '00000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_ENROUTE
            ],

            'jbc - 3088' : [
                {
                    'number' : '3088' + '000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_JBC
            ],
            'jbc - 3096' : [
                {
                    'number' : '3096' + '000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_JBC
            ],
            'jbc - 3112' : [
                {
                    'number' : '3112' + '000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_JBC
            ],
            'jbc - 3158' : [
                {
                    'number' : '3158' + '000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_JBC
            ],
            'jbc - range' : [
                {
                    'number' : '35280001' + '00000000' 
                },
                imports.PaymentDetails.CARD_TYPE_JBC
            ],

            'mastercard - 51' : [
                {
                    'number' : '51' + '00000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_MASTERCARD
            ],
            'mastercard - 52' : [
                {
                    'number' : '52' + '00000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_MASTERCARD
            ],
            'mastercard - 53' : [
                {
                    'number' : '53' + '00000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_MASTERCARD
            ],
            'mastercard - 54' : [
                {
                    'number' : '54' + '00000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_MASTERCARD
            ],
            'mastercard - 55' : [
                {
                    'number' : '55' + '00000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_MASTERCARD
            ],

            'visa - 13 digits' : [
                {
                    'number' : '4' + '000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_VISA
            ],
            'visa - 16 digits' : [
                {
                    'number' : '4' + '000000000000000' 
                },
                imports.PaymentDetails.CARD_TYPE_VISA
            ],

            'unknown card' : [
                {
                    'number' : '000000000000000' 
                },
                null
            ],
        }, function(data, expected) {
            it('return the expected card type', function(done) {
                let details = new imports.PaymentDetails(data);
                imports.should(details.getCardType()).eql(expected);
                done();
            });
        });

        it('should return null on empty', function(done) {
            let details = new imports.PaymentDetails();
            imports.should(details.getCardType()).eql(null);
            done();
        });
    });

    describe('isAmex', function() {
        imports.leche.withData({
            'amex - 3 and 4' : [
                {
                    'number' : '340000000000000' 
                },
                true
            ],
            'visa - 16 digits' : [
                {
                    'number' : '4' + '000000000000000' 
                },
                false
            ],
            'unknown' : [
                {
                    'number' : '000000000000000' 
                },
                false
            ],
        }, function(data, expected) {
            it('return true for amex cards', function(done) {
                let details = new imports.PaymentDetails(data);
                imports.should(details.isAmex()).eql(expected);
                done();
            });
        });
    });
});