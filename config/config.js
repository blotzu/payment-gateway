module.exports = {
    'app' : {
        'port' : 3000,
        'session' : {
            'secret' : 'some secret key',
            'resave' : false,
            'saveUninitialized' : true,
        }
    },
    'order' : {
        'currencies' : ['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD'],
    },
    'gateway': {
        'braintree' : {
            'merchantId' : "kd8gf79xkmwjbp65",
            'publicKey' : "dgx3p9sxtcyckfw7",
            'privateKey' : "6ec9ccff48b388c924c657319bf8ccfb",
        }
    }
};