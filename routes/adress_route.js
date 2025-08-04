const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const{create_adresses,delete_adresses,get_adresses}= require('../services/adress_services');
const allow_to = require('../middelware/allow_to');
router.route('/').post(
    auth_services.protect,
    allow_to('user'),
    create_adresses
)
.get(
    auth_services.protect,
    allow_to('user'),
    get_adresses
);
router.route('/:adressId').delete(
    auth_services.protect,
    allow_to('user'),
    delete_adresses
);

module.exports =router;