'use strict';

require('./app/bootstrap.js');

let imports = {
    'gulp' : require('gulp'),
    'child_process' : require('child_process'),
    'gulpUtil' : require('gulp-util'),
    'services' : require('./app/services.js'),
};

// initialize the db schema
imports.gulp.task('init-db', () => {
    // create the db
    let dbName = imports.services.config()['db']['connection']['database'];
    let dbUser = imports.services.config()['db']['connection']['user'];
    let dbPassword = imports.services.config()['db']['connection']['password'];
    
    // create the user
    imports.child_process.execSync(`echo "create user ${dbUser} with password '${dbPassword}'" | psql -U postgres`);
    imports.child_process.execSync(`createdb -U postgres --owner=${dbUser} ${dbName}`);

    // create the tables
    let db = imports.services.db();
    db.schema.createTableIfNotExists('order', function(table) {
        table.increments('id');
        table.float('price');
        table.string('currency');
        table.string('customer_name');
    }).then(() => {
        imports.gulpUtil.log('Created table transactions');

        return db.schema.createTableIfNotExists('transaction', function(table) {
            table.increments('id');
            table.integer('order_id').references('id').inTable('order');
            table.json('gateway_response');
        });
    }).then(() => {
        imports.gulpUtil.log('Created table transaction');
        process.exit(0);
    });
});
