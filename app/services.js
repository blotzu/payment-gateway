'use strict';

let serviceMap = {};

let services = {
    getService : function(name, callback) {
        if (name in serviceMap) {
            return serviceMap[name];
        }
        return callback();
    },
    'config' : function() {
        return require('../config/config.js');
    },
};

module.exports = services;