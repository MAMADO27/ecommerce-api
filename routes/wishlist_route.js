const express = require('express');
const router = express.Router();

const protect = require('../services/auth_services').protect;
const allow_to = require('../middelware/allow_to');
console.log('allow_to:', allow_to);

const { create_wishlist, delete_wishlist, get_wishlist } = require('../services/wishlist_services');

router.route('/')
  .post(protect, allow_to('user'), create_wishlist)
  .get(protect, allow_to('user'), get_wishlist);

router.route('/:productId')
  .delete(protect, allow_to('user'), delete_wishlist);

module.exports = router;

