const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const allow_to = require('../middelware/allow_to');

const {
  create_cash_order,
  find_all_orders,
  find_specific_order,
  update_order_to_paid,
  update_order_to_delivered,
  filter_order_for_logged_user,
  checkout_session
} = require('../services/order_services');


router.use(auth_services.protect);
router.use(filter_order_for_logged_user);


router.get('/checkout-session/:cartId', checkout_session);


router.route('/')
  .get(allow_to('user', 'admin', 'manager'), find_all_orders);


router.route('/:cartId')
  .post(allow_to('user'), create_cash_order);


router.route('/:id')
  .get(allow_to('user', 'admin', 'manager'), find_specific_order)
  .put(allow_to('admin', 'manager'), update_order_to_paid);


router.route('/:id/deliver')
  .put(allow_to('admin', 'manager'), update_order_to_delivered);


// router.post('/webhook-checkout', order_services.webhook_checkout);

module.exports = router;
