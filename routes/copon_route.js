const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const { param, validationResult } = require('express-validator');


const {
  get_copons,
  get_copon,
  create_copon,
  update_copon,
 delete_copon
} = require('../services/copon_services');
const allow_to = require('../middelware/allow_to');

router.route('/')
  .get(get_copons)
  .post(auth_services.protect,
  allow_to('admin', 'manager'),
  /*create_brand_validator,*/ create_copon);

router.route('/:id')
  .get(/*get_brand_validator,*/ get_copon)
  .put(auth_services.protect,
  allow_to('admin', 'manager'),
    /*update_brand_validator,*/ update_copon)
  .delete(auth_services.protect,
  allow_to('admin'),
   /* delete_brand_validator,*/ delete_copon);

module.exports = router;