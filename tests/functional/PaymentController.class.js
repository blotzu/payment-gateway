'use strict';

// start the app
let app = require('../../index.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should')
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
