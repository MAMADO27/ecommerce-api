const asyncHandler = require('express-async-handler');
const Review = require('../modules/review_module');
const Product = require('../modules/product_module');
const User = require('../modules/user_module');
const factory = require('../services/handler_factory');


exports.create_filter_object = (req, res, next) => {
    let filter_Object = {};
    if (req.params.product_Id) filter_Object = { product: req.params.product_Id };
    req.filter_Object = filter_Object;
    next();
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.get_reviews = factory.get_all(Review, 'reviews');
// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.get_review = factory.get_one(Review);
//
exports.set_product_user_id = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.product_Id;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};
// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
exports.create_review = factory.create_one(Review);
// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.update_review = factory.update_one(Review);
// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.delete_review = factory.delete_one(Review);

