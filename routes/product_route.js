const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const { param, validationResult } = require('express-validator');
const {
  get_product_validator,
  create_product_validator,
  update_product_validator,
  delete_product_validator
} = require('../utils/validator/product_validator');
const {
  get_products,
  get_product,
  create_product,
  update_product,
  delete_product,
  Product_image_upload,
  resize_product_images
} = require('../services/product_services');
const allow_to = require('../middelware/allow_to');

router.use('/:productId/reviews', require('./review_route'));



router.route('/')
  .get(get_products)
  .post(auth_services.protect,
  /*auth_services.*/allow_to('admin', 'manager'),
    Product_image_upload,resize_product_images,create_product_validator, create_product);

router.route('/:id')
  .get(get_product_validator, get_product)
  .put( auth_services.protect,
  /*auth_services.*/allow_to('admin', 'manager'),
    Product_image_upload,
  resize_product_images,update_product_validator, update_product)
  .delete(auth_services.protect,
  /*auth_services.*/allow_to('admin'),
    delete_product_validator, delete_product);

module.exports = router;