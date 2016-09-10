'use strict';

require('../../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'leche' : require('leche'),
    'services'  : require(__commonPath + '/app/services.js'),
    'OrderController' : require(__commonPath + '/app/controllers/OrderController.class'),
};

describe('OrderController', function() {
    describe('validatePostValues', function() {
        imports.leche.withData({
            'no data' : [
                {},
                {},
                {
                    price: 'Please enter a valid price',
                    currency: 'Please enter a valid currency',
                    name: 'Please enter a valid name'
                }
            ],
            'invalid values' : [
                {
                    'price' : -1,
                    'currency' : 'EUR',
                    'name' : '   ',
                },
                {},
                {
                    price: 'Please enter a valid price',
                    currency: 'Please enter a valid currency',
                    name: 'Please enter a valid name'
                }
            ],
            'valid values' : [
                {
                    'price' : 123,
                    'currency' : 'USD',
                    'name' : 'some name   ',
                },
                {
                    'price' : 123,
                    'currency' : 'USD',
                    'name' : 'some name',
                },
                {}
            ],
        }, function(postData, expectedValue, expectedErrors) {
            it('should validate the input arguments', function(done) {

                // set the currencies
                imports.services.config()['order']['currencies'] = ['USD'];

                let controller = new imports.OrderController({});

                controller.validatePostValues(postData);

                imports.should(controller.getFormValues()).eql(expectedValue);
                imports.should(controller.getFormErrors()).eql(expectedErrors);

                done();
            });
        });
    });
});
