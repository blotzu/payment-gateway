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

    describe('processPaymentForm', function() {
        imports.leche.withData({
            'form errors' : [
                {'key' : 'value'}
            ],
        }, function(formErrors) {
            it('render when validation fails', function(done) {
                let controller = new imports.PaymentController({});
                controller.render = imports.sinon.spy(function(){});
                controller.validatePostValues = imports.sinon.spy(function(){
                    this.formErrors = formErrors;
                });

                let req = {};
                let res = {};
                controller.processPaymentForm(req, res);

                controller.render.callCount.should.eql(1);

                done();
            });
        });

        imports.leche.withData({
            'no errors' : [
                {
                    'session' : {
                        'orderIds' : [1]
                    }
                },
                {},
                {
                    'id' : 1
                }
            ],
        }, function(req, res, order) {
            let newGateway;
            let oldGateway;

            beforeEach(function() {
                newGateway = {};
                oldGateway = imports.services.gateway();
                imports.services.setService('gateway', newGateway);
            });
            afterEach(function() {
                imports.services.setService('gateway', oldGateway);
            });

            it('pay on success', function(done) {
                newGateway.pay = imports.sinon.spy(function(){});

                let controller = new imports.PaymentController({});
                controller.validatePostValues = imports.sinon.spy(function(){});

                controller.processPaymentForm(req, res, order);

                newGateway.pay.callCount.should.eql(1);

                done();
            });
        });
    });

    describe('processGatewayResponse', function() {
        imports.leche.withData({
            'transaction error - no response' : [
                {},
                'some errors',
                null
            ],
            'transaction error - with response' : [
                {},
                'some errors',
                {}
            ],
        }, function(order, err, gatewayResponse) {
            let newTransactionRepository;
            let oldTransactionRepository;

            beforeEach(function() {
                newTransactionRepository = {};
                oldTransactionRepository = imports.services.gateway();
                imports.services.setService('transactionRepository', newTransactionRepository);
            });
            afterEach(function() {
                imports.services.setService('transactionRepository', oldTransactionRepository);
            });

            it('return error on transcation error', function(done) {
                newTransactionRepository.create = imports.sinon.spy(function(){ return newTransactionRepository; });
                newTransactionRepository.then = imports.sinon.spy(function(cb){ cb(); return newTransactionRepository; });
                newTransactionRepository.catch = imports.sinon.spy(function(){ return newTransactionRepository; });

                let controller = new imports.PaymentController({});
                controller.returnPaymentError = imports.sinon.spy(function(){});
                controller.returnPaymentSuccess = imports.sinon.spy(function(){});

                let res = {};
                controller.processGatewayResponse(res, order, err, gatewayResponse);

                controller.returnPaymentError.callCount.should.eql(1);

                done();
            });
        });

        imports.leche.withData({
            'transaction error - with response' : [
                {},
                'some errors',
                {}
            ],
        }, function(order, err, gatewayResponse) {
            let newTransactionRepository;
            let oldTransactionRepository;

            beforeEach(function() {
                newTransactionRepository = {};
                oldTransactionRepository = imports.services.gateway();
                imports.services.setService('transactionRepository', newTransactionRepository);
            });
            afterEach(function() {
                imports.services.setService('transactionRepository', oldTransactionRepository);
            });

            it('return error on create error', function(done) {
                newTransactionRepository.create = imports.sinon.spy(function(){ return newTransactionRepository; });
                newTransactionRepository.then = imports.sinon.spy(function(){ return newTransactionRepository; });
                newTransactionRepository.catch = imports.sinon.spy(function(cb){ cb('some err'); return newTransactionRepository; });

                let controller = new imports.PaymentController({});
                controller.returnPaymentError = imports.sinon.spy(function(){});
                controller.returnPaymentSuccess = imports.sinon.spy(function(){});

                let res = {};
                controller.processGatewayResponse(res, order, err, gatewayResponse);

                controller.returnPaymentError.callCount.should.eql(1);

                done();
            });
        });

        imports.leche.withData({
            'transaction success - no payload' : [
                {},
                null,
                {}
            ],
            'transaction error - with response' : [
                {},
                null,
                {}
            ],
        }, function(order, err, gatewayResponse) {
            let newTransactionRepository;
            let oldTransactionRepository;

            beforeEach(function() {
                newTransactionRepository = {};
                oldTransactionRepository = imports.services.gateway();
                imports.services.setService('transactionRepository', newTransactionRepository);
            });
            afterEach(function() {
                imports.services.setService('transactionRepository', oldTransactionRepository);
            });

            it('return error on transcation error', function(done) {
                newTransactionRepository.create = imports.sinon.spy(function(){ return newTransactionRepository; });
                newTransactionRepository.then = imports.sinon.spy(function(cb){ cb(); return newTransactionRepository; });
                newTransactionRepository.catch = imports.sinon.spy(function(){ return newTransactionRepository; });

                let controller = new imports.PaymentController({});
                controller.returnPaymentError = imports.sinon.spy(function(){});
                controller.returnPaymentSuccess = imports.sinon.spy(function(){});

                let res = {};
                controller.processGatewayResponse(res, order, err, gatewayResponse);

                controller.returnPaymentSuccess.callCount.should.eql(1);

                done();
            });
        });

    });

    describe('returnPaymentError', function() {
        it('should redirect', function(done) {
            let controller = new imports.PaymentController({});

            let res = {
                'redirect' : imports.sinon.spy(function(path){
                    imports.should(path.match('error') !== null).eql(true);
                    done();
                })
            };
            controller.returnPaymentError(res, '');
        });
    });

    describe('returnPaymentSuccess', function() {
        it('should redirect', function(done) {
            let controller = new imports.PaymentController({});

            let res = {
                'redirect' : imports.sinon.spy(function(path){
                    imports.should(path.match('success') !== null).eql(true);
                    done();
                })
            };
            controller.returnPaymentSuccess(res);
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
