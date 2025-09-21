const mongoose = require('mongoose');
const cart_schema = new mongoose.Schema({
    cart_items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        },
        quantity: {
            type: Number,
            default: 1,
        },
        color:String,
        price:Number,


    }],
    total_cart_price:Number,
    total_cart_price_after_discount:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = mongoose.model('Cart',cart_schema);