module.exports = {
    'app' : {
        'port' : 3000,
        'session' : {
            'secret' : 'some secret key',
            'resave' : false,
            'saveUninitialized' : true,
        }
    },
    'db' : {
        'client' : 'pg',
        'connection': {
            charset: 'utf8',
            host : '127.0.0.1',
            port : 5432,
            user : 'payment',
            password : 'payment',
            database : 'payment',
        },
        'pool' : {
            'min' : 0,
            'max' : 1,
        },
    },
    'order' : {
        'currencies' : ['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD'],
    },
    'gateway': {
        'braintree' : {
            'merchantId' : "kd8gf79xkmwjbp65",
            'publicKey' : "dgx3p9sxtcyckfw7",
            'privateKey' : "6ec9ccff48b388c924c657319bf8ccfb",
        },
        'paypal' : {
            'mode' : 'sandbox',
            'client_id': 'AUDyjoTmFNRIM7DDT1Zl8n77EfSswt1sDaxIB2ch3O4Z5MgzpQZr7a0jBgnxA1vhKsiSy3XvG0njkd88',
            'client_secret': 'ED--nIXr2TZdWWnm8BigMvq58Cr6F2rR3SH9EN6KI5bQYPaITVKkmZNd_AfzHWE3SVgSZ7RdRhhmR_iK'
        }
    },
    'entities' : {
        'Order' : {
            'tableName' : 'order',
        },
        'Transaction' : {
            'tableName' : 'transaction',
        }
    }
};