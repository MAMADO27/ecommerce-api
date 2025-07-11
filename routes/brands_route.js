const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const { param, validationResult } = require('express-validator');
const {
  get_brand_validator,
  create_brand_validator,
  update_brand_validator,
  delete_brand_validator
} = require('../utils/validator/brands_validator');
const {
  get_brands,
  get_brand,
  create_brand,
  update_brand,
  delete_brand,resize_brand_image,
  uploud_brand_image
} = require('../services/brands_services');
const allow_to = require('../middelware/allow_to');

router.route('/')
  .get(get_brands)
  .post(auth_services.protect,
  /*auth_services.*/allow_to('admin', 'manager'),
  uploud_brand_image,resize_brand_image,create_brand_validator, create_brand);

router.route('/:id')
  .get(get_brand_validator, get_brand)
  .put(auth_services.protect,
  /*auth_services.*/allow_to('admin', 'manager'),
    resize_brand_image,
  uploud_brand_image,update_brand_validator, update_brand)
  .delete(auth_services.protect,
  /*auth_services.*/allow_to('admin'),
    delete_brand_validator, delete_brand);

module.exports = router;