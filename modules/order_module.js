const mongoose = require('mongoose');

const order_schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must be belong to user'],
    },
    cart_items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],

    tax_price: {
      type: Number,
      default: 0,
    },
    shipping_address: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    shipping_price: {
      type: Number,
      default: 0,
    },
    total_order_price: {
      type: Number,
    },
    payment_method_type: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash',
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
    paid_at: Date,
    is_delivered: {
      type: Boolean,
      default: false,
    },
    delivered_at: Date,
  },
  { timestamps: true }
);

order_schema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImg email phone',
  }).populate({
    path: 'cartItems.product',
    select: 'title imageCover ',
  });

  next();
});

module.exports = mongoose.model('Order', order_schema);