'use strict';

// start the app
let app = require('../../index.js');

let imports = {
    'supertest' : require('supertest'),
    'leche' : require('leche'),
    'sinon' : require('sinon'),
    'should' : require('should'),
    'services' : require(__commonPath + '/app/services.js'),
    'OrderController' : require(__commonPath + '/app/controllers/OrderController.class.js'),
};

describe('/order-form', function() {
    it('the order form should load', function(done) {
        imports.supertest(app)
            .get('/order-form')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('order form should work on submit', function(done) {
        imports.supertest(app)
            .post('/order-form')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    describe('orderFormSubmit', function() {
        imports.leche.withData({
            'valid values' : [
                {
                    'price' : 123,
                    'currency' : 'USD',
                    'name' : 'some name',
                },
                123
            ],
        }, function(postData, orderId) {
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

            it('redirect on success', function(done) {
                newOrderRepository.create = imports.sinon.spy(function(){ return newOrderRepository; });
                newOrderRepository.then = imports.sinon.spy(function(cb){ cb(orderId); return newOrderRepository; });
                newOrderRepository.catch = imports.sinon.spy(function(){ return newOrderRepository; });

                let controller = new imports.OrderController({});
                controller.render = imports.sinon.spy(function(){});

                let req = {
                    'body' : postData,
                    'session' : {}
                };
                let res = {
                    'redirect' : imports.sinon.spy(function(){})
                };

                controller.orderFormSubmit(req, res);

                imports.should(req.session.orderIds).eql([orderId]);
                res.redirect.callCount.should.eql(1);

                done();
            });

            it('render the template on failure', function(done) {
                newOrderRepository.create = imports.sinon.spy(function(){ return newOrderRepository; });
                newOrderRepository.then = imports.sinon.spy(function(cb){ return newOrderRepository; });
                newOrderRepository.catch = imports.sinon.spy(function(cb){ cb(orderId); return newOrderRepository; });

                let controller = new imports.OrderController({});
                controller.render = imports.sinon.spy(function(){});

                let req = {
                    'body' : postData,
                    'session' : {}
                };
                let res = {};

                controller.orderFormSubmit(req, res);

                controller.render.callCount.should.eql(1);

                done();
            });
        });
    });
});