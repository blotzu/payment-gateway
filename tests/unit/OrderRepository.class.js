'use strict';

require('../../app/bootstrap.js');

let imports = {
    'supertest' : require('supertest'),
    'should' : require('should'),
    'sinon' : require('sinon'),
    'OrderRepository' : require(__commonPath + '/lib/OrderRepository.class.js'),
};

describe('OrderRepository', function() {
    let tableName = 'some_table';
    let db;
    db = imports.sinon.spy(function(table) {
        table.should.equal(tableName);
        return db;
    });

    db.select = imports.sinon.spy(function() {return db; });
    db.where = imports.sinon.spy(function() {return db; });
    db.insert = imports.sinon.spy(function() {return db; });
    db.then = imports.sinon.spy(function() {return db; });
    db.catch = imports.sinon.spy(function() {return db; });
    db.returning = imports.sinon.spy(function() {return db; });

    let repo = new imports.OrderRepository(db, tableName);

    describe('create', function() {
        it('create should try to insert', function(done) {
            let res = repo.create();
            db.insert.callCount.should.be.eql(1);
            done();
        });
    });

    describe('findById', function() {
        it('should select and fiter', function(done) {
            let res = repo.findById('some id');
            db.select.callCount.should.be.eql(1);
            db.where.callCount.should.be.eql(1);
            done();
        });
    });
});