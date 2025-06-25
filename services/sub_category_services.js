var slugify = require('slugify'); 
const SubCategory = require('../modules/sub_category_model');
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');
const Category = require('../modules/category_module');

// set categoryId to body if not present
exports.set_categoryId_to_body = (req, res, next) => {
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
};

// @ desc    Create a new sub category
// @ route   POST /api/v1/Subcategories
// @ access  Private
exports.create_sub_category = factory.create_one(SubCategory, 'Subcategories');

// @ desc    Get all sub categories
// @ route   GET /api/v1/Subcategories
// @ access  Public
exports.get_sub_categories = factory.get_all(SubCategory, 'Subcategories');

// @ desc    Get a single sub category
// @ route   GET /api/v1/Subcategories/:id
// @ access  Public
exports.get_sub_category = factory.get_one(SubCategory);

// @ desc    Update a sub category
// @ route   PUT /api/v1/Subcategories/:id
// @ access  Private
exports.update_sub_category = factory.update_one(SubCategory);

// @ desc    Delete a sub category
// @ route   DELETE /api/v1/Subcategories/:id
// @ access  Private
exports.delete_sub_category = factory.delete_one(SubCategory);
