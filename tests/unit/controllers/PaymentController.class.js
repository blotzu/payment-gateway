'use strict';

require('../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'services'  : require(__commonPath + '/app/services.js'),
    'PaymentController' : require(__commonPath + '/app/controllers/PaymentController.class.js'),
};

describe('PaymentController', function() {
    describe('validatePostValues', function() {
        imports.leche.withData({
            'no data' : [
                {},
                {},
                {
                    "cvv": "Please enter a valid CVV",
                    "expiration": "Please enter a valid expiration date",
                    "name": "Please enter a valid name",
                    "number": "Please enter a valid card number"
                }
            ],
            'invalid values' : [
                {
                    'name' : ' ',
                    'number' : 'aaa',
                    'expire_month' : '23',
                    'expire_year' : '123',
                    'cvv' : 'asd',
                },
                {},
                {
                    "cvv": "Please enter a valid CVV",
                    "expiration": "Please enter a valid expiration date",
                    "name": "Please enter a valid name",
                    "number": "Please enter a valid card number"
                }
            ],
            'valid values' : [
                {
                    'name' : 'some name',
                    'number' : '123',
                    'expire_month' : '01',
                    'expire_year' : (new Date()).getFullYear().toString(),
                    'cvv' : '123',
                },
                {
                    'name' : 'some name',
                    'number' : '123',
                    'expire_month' : '01',
                    'expire_year' : (new Date()).getFullYear().toString(),
                    'cvv' : 123,
                },
                {}
            ],
        }, function(postData, expectedValue, expectedErrors) {
            it('should validate the input arguments', function(done) {
                let controller = new imports.PaymentController({});

                controller.validatePostValues(postData);

                imports.should(controller.getFormValues()).eql(expectedValue);
                imports.should(controller.getFormErrors()).eql(expectedErrors);

                done();
            });
        });
    });
});
