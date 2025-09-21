const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const { param, validationResult } = require('express-validator');

const {
 add_to_cart,get_user_cart,remove_cart_item,remove_cart,update_cart_item_quantity,apply_copon
} = require('../services/cart_services');
const allow_to = require('../middelware/allow_to');

router.route('/')
  .post(auth_services.protect,
   allow_to('user'),
   add_to_cart)
  .get(auth_services.protect,
  allow_to('user'),
  get_user_cart)
  .delete(auth_services.protect,
  allow_to('user'),
  remove_cart);

router.route('/apply-copon')
  .put(auth_services.protect,
  allow_to('user'),
  apply_copon);
router.route('/:itemId').
put(auth_services.protect,
allow_to('user'),
update_cart_item_quantity).
delete(auth_services.protect,
allow_to('user'),remove_cart_item),



module.exports = router;