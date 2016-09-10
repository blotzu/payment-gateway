'use strict';

// start the app
let app = require('../../index.js');

let imports = {
    'supertest' : require('supertest'),
    'leche' : require('leche'),
    'sinon' : require('sinon'),
    'should' : require('should'),
    'services' : require(__commonPath + '/app/services.js'),
    'PaymentController' : require(__commonPath + '/app/controllers/PaymentController.class.js'),
};

describe('/payment-form', function() {
    it('the payment form should redirect to the order for invalid order ids', function(done) {
        imports.supertest(app)
            .get('/payment-form?orderId=unknown')
            .expect(302)
            .end(function(err, res) {
                if (err) return done(err);
                res.headers.location.should.eql('/order-form');
                done();
            });
    });

    describe('getOrderDetails', function() {
        imports.leche.withData({
            'valid order id' : [
                12345,
                {
                    'orderIds' : [12345]
                },
                null,
                {
                    'key' : 'value'
                }
            ],
            'missing order id argument' : [
                null,
                {
                    'orderIds' : [12345]
                },
                null,
                undefined
            ],
            'order id not in the user session' : [
                123,
                {
                    'orderIds' : [12345]
                },
                null,
                undefined
            ],
            'order does not exist' : [
                12345,
                {
                    'orderIds' : [12345]
                },
                'Could not find order',
                undefined
            ],
        }, function(orderId, session, expectedError, expectedResponse) {
            let oldOrderRepository;
            let newOrderRepository;

            beforeEach(function() {
                newOrderRepository = {};
                oldOrderRepository = imports.services.orderRepository();
                // set the currencies
                imports.services.setService('orderRepository', newOrderRepository);
            });
            afterEach(function() {
                imports.services.setService('orderRepository', oldOrderRepository);
            });

            it('should execute callback on success', function(done) {
                newOrderRepository.findById = imports.sinon.spy(function(){ return newOrderRepository; });
                newOrderRepository.then = imports.sinon.spy(function(cb){ cb(expectedResponse); return newOrderRepository; });
                newOrderRepository.catch = imports.sinon.spy(function(){ return newOrderRepository; });

                let controller = new imports.PaymentController({});
                controller.render = imports.sinon.spy(function(){});

                let req = {
                    'query' : {
                        'orderId' : orderId,
                    },
                    'session' : session
                };
                controller.getOrderDetails(req, (err, response) => {
                    imports.should(err).eql(expectedError);
                    imports.should(response).eql(expectedResponse);
                    done();
                });

            });
        });
    });

    describe('paymentForm', function() {
        imports.leche.withData({
            'order error' : [
                'some error',
                {'key' : 'value'}
            ],
            'no order' : [
                null,
                undefined
            ],
        }, function(err, order) {
            it('should redirect on fail', function(done) {
                let controller = new imports.PaymentController({});
                controller.render = imports.sinon.spy(function(){});
                controller.getOrderDetails = imports.sinon.spy(function(req, cb){ return cb(err, order); });

                let req = {};
                let res = {
                    'redirect' : imports.sinon.spy(function(){})
                };
                controller.paymentForm(req, res);

                res.redirect.callCount.should.eql(1);

                done();
            });
        });

        imports.leche.withData({
            'some order' : [
                null,
                {'key' : 'value'}
            ],
        }, function(err, order) {
            it('should render on success', function(done) {
                let controller = new imports.PaymentController({});
                controller.render = imports.sinon.spy(function(){});
                controller.getOrderDetails = imports.sinon.spy(function(req, cb){ return cb(err, order); });

                let req = {};
                let res = {};
                controller.paymentForm(req, res);

                controller.render.callCount.should.eql(1);

                done();
            });
        });
    });

    describe('paymentFormSubmit', function() {
        imports.leche.withData({
            'order error' : [
                'some error',
                {'key' : 'value'}
            ],
            'no order' : [
                null,
                undefined
            ],
        }, function(err, order) {
            it('redirect on fail', function(done) {
                let controller = new imports.PaymentController({});
                controller.render = imports.sinon.spy(function(){});
                controller.getOrderDetails = imports.sinon.spy(function(req, cb){ return cb(err, order); });

                let req = {};
                let res = {
                    'redirect' : imports.sinon.spy(function(){})
                };
                controller.paymentForm(req, res);

                res.redirect.callCount.should.eql(1);

                done();
            });
        });

        imports.leche.withData({
            'some order' : [
                null,
                {'key' : 'value'}
            ],
        }, function(err, order) {
            it('should process the payment on success', function(done) {
                let controller = new imports.PaymentController({});
                controller.render = imports.sinon.spy(function(){});
                controller.getOrderDetails = imports.sinon.spy(function(req, cb){ return cb(err, order); });
                controller.processPaymentForm = imports.sinon.spy(function(){});

                let req = {};
                let res = {};
                controller.paymentFormSubmit(req, res);

                controller.processPaymentForm.callCount.should.eql(1);

                done();
            });
        });
    });
});

describe('/payment-finalized', function() {
    it('the payment finalized success page should load', function(done) {
        imports.supertest(app)
            .get('/payment-finalized?success=1')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('the payment finalized error page should load', function(done) {
        imports.supertest(app)
            .get('/payment-finalized?error=some error')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});
