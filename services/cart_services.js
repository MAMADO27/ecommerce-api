const Cart = require('../modules/cart_module');
const Copon = require('../modules/copon_module');
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');
const Product = require('../modules/product_module');
const { number } = require('joi');

const calc_total_cart_price = (cart_items) => {
    return cart_items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);}


// @ desc    Get all carts
// @ route   GET /api/v1/carts
// @ access  private

exports.add_to_cart = asyncHandler(async (req, res, next) => {
    const { productId, quantity, color } = req.body;
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return next(new api_error('the number must be greater than 0', 400));
    }

    const product = await Product.findById(productId);
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cart_items: [{ product: productId, quantity: parsedQuantity, color, price: product.price }] });
    }
    else {
        const product_exists = cart.cart_items.findIndex(item => item.product.toString() === productId && item.color === color);
        if (product_exists > -1) {
            const existing_item = cart.cart_items[product_exists];
            existing_item.quantity += parsedQuantity;
            cart.cart_items[product_exists] = existing_item;
        }
        else {
            cart.cart_items.push({ product: productId, quantity: parsedQuantity, color, price: product.price });
        }
    }
    cart.total_cart_price = calc_total_cart_price(cart.cart_items);
    cart.total_cart_price_after_discount = cart.total_cart_price; // Assuming no discounts applied for now

    await cart.save();
    res.status(201).json({
        status: 'success',
        data: {
            cart
        }
    });
});

// @ desc    Get logged user carts
// @ route   GET /api/v1/carts
// @ access  private
exports.get_user_cart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id })//.populate('cart_items.product', 'name price image');
    if (!cart) {
        return next(new api_error('No cart found for this user', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            cart
        },
        number_of_items: cart.cart_items.length,
        total_cart_price: cart.total_cart_price,
        total_cart_price_after_discount: cart.total_cart_price_after_discount
    });
});

// @ desc    Remove cart item
// @ route   DELETE /api/v1/carts/itemId
// @ access  private
exports.remove_cart_item = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new api_error('No Cart For This User', 404));
        

    }
    cart.cart_items = cart.cart_items.filter(
        item => item._id.toString() !== req.params.itemId
    );
    cart.total_cart_price = calc_total_cart_price(cart.cart_items);
    cart.total_cart_price_after_discount = cart.total_cart_price; 

    await cart.save();
    res.status(201).json({
        status: 'success',
        data: { cart }
    });
});

// @ desc    Remove cart 
// @ route   DELETE /api/v1/carts
// @ access  private
exports.remove_cart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    res.status(204).json({
        status: 'success',
        data: null
    });
});

// @ desc    Update cart itm quantity 
// @ route   PUT /api/v1/carts/itemId
// @ access  private
exports.update_cart_item_quantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new api_error('No Cart For This User', 404));
    }
    const item_index = cart.cart_items.findIndex(item => item._id.toString() === req.params.itemId);
    if (item_index > -1) {
        const item = cart.cart_items[item_index];
        item.quantity = Number(quantity);
        cart.cart_items[item_index] = item;
        
    
    }else{
        return next(new api_error('Item not found in cart', 404));

    }
cart.total_cart_price = calc_total_cart_price(cart.cart_items);
cart.total_cart_price_after_discount = cart.total_cart_price; 
    await cart.save();
    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// @ desc    Aplly Copon 
// @ route   PUT /api/v1/carts
// @ access  private
exports.apply_copon = asyncHandler(async (req, res, next) => {
    const copon = await Copon.findOne({
        code: req.body.code,
        expire: { $gt: Date.now() }
    });

    if (!copon) {
        return next(new api_error('Invalid or expired copon code', 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new api_error('Cart not found for this user', 404));
    }
    cart.cart_items = cart.cart_items.filter(item => item.product);
    const total_price = calc_total_cart_price(cart.cart_items);
    const discount_amount = total_price - (total_price * (copon.discount / 100));

    cart.total_cart_price = total_price;
    cart.total_cart_price_after_discount = discount_amount;
    await cart.save();
    res.status(200).json({
        status: 'success',
        data: { cart },
        discount: copon.discount,
        total_cart_price_after_discount: cart.total_cart_price_after_discount
    });
});

