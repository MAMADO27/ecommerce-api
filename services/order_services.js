const stripe = require('stripe')(process.env.STRIPE_SECRET);
const async_handler = require('express-async-handler');
const factory = require('../services/handler_factory');
const api_error = require('../utils/api_error');

const User = require('../modules/user_module');
const Product = require('../modules/product_module');
const Cart = require('../modules/cart_module');
const Order = require('../modules/order_module');

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.create_cash_order = async_handler(async (req, res, next) => {
  // app settings
  const tax_price = 0;
  const shipping_price = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new api_error(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cart_price = cart.total_cart_price_after_discount
    ? cart.total_cart_price_after_discount
    : cart.total_cart_price;

  const total_order_price = cart_price + tax_price + shipping_price;

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartI_items: cart.cart_items,
    shipping_address: req.body.shipping_address,
    totalOrderPrice: total_order_price,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulk_option = cart.cart_items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulk_option, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: 'success', data: order });
});

exports.filter_order_for_logged_user = async_handler(async (req, res, next) => {
  if (req.user.role === 'user') req.filter = { user: req.user._id };
  next();
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.find_all_orders = factory.get_all(Order);

// @desc    Get specific order
// @route   GET /api/v1/orders/:id
// @access  Protected/User-Admin-Manager
exports.find_specific_order = factory.get_one(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.update_order_to_paid = async_handler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new api_error(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.is_paid = true;
  order.paid_at = Date.now();

  const updated_order = await order.save();

  res.status(200).json({ status: 'success', data: updated_order });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.update_order_to_delivered = async_handler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new api_error(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to delivered
  order.is_delivered = true;
  order.delivered_at = Date.now();

  const updated_order = await order.save();

  res.status(200).json({ status: 'success', data: updated_order });
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkout_session = async_handler(async (req, res, next) => {
  // app settings
  const tax_price = 0;
  const shipping_price = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new api_error(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cart_price = cart.total_cart_price_after_discount
    ? cart.total_cart_price_after_discount
    : cart.total_cart_price;

  const total_order_price = cart_price + tax_price + shipping_price;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
          unit_amount: total_order_price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: 'success', session });
});

/*const create_card_order = async (session) => {
  const cart_id = session.client_reference_id;
  const shipping_address = session.metadata;
  const order_price = session.amount_total / 100;

  const cart = await Cart.findById(cart_id);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress: shipping_address,
    totalOrderPrice: order_price,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulk_option = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulk_option, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cart_id);
  }
};*/

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
/*exports.webhook_checkout = async_handler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    create_card_order(event.data.object);
  }

  res.status(200).json({ received: true });
});*/