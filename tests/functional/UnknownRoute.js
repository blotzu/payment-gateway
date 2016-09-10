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
