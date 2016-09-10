'use strict';

// start the app
let app = require('../../index.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should')
};

describe('GET /', function() {
    it('unknown routes should return 404', function(done) {
        imports.supertest(app)
            .get('/')
            .expect(404, {}, done);
    });
});

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

    it('the order form should load', function(done) {
        imports.supertest(app)
            .post('/order-form')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});