var slugify = require('slugify'); 
const multer = require('multer');
const sharp = require('sharp');
const {v4: uuidv4} = require('uuid');
const Category = require('../modules/category_module'); 
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');
const mongoose = require('mongoose');
const {upload_single_image} = require('../middelware/uploud_image_midelware');




const multer_storage = multer.memoryStorage(); // Store files in memory for processing with sharp
const multer_filter = (req, file, cb) => {
     console.log('File mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.', 400), false);
    }
}
// Set up multer for image upload
const uploud= multer({storage:multer_storage,fileFilter: multer_filter});
exports.uploud_category_image = upload_single_image('image'); // Use the middleware to handle image upload

exports.resize_category_image = async (req, res, next) => {
    if (!req.file) return next();
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
    next();
};


// @ desc    Get all categories
// @ route   GET /api/v1/categories
// @ access  Public
exports.getcategories = factory.get_all(Category, 'categories');

// @ desc    Get a single category
// @ route   GET /api/v1/categories/:id
// @ access  Public
exports.getcategory = factory.get_one(Category);

// @ desc    Create a new category
// @ route   POST /api/v1/categories
// @ access  Private
exports.create_category = factory.create_one(Category);

// @ desc    Update a category
// @ route   PUT /api/v1/categories/:id
// @ access  Private
exports.update_category = factory.update_one(Category);

// @ desc    Delete a category
// @ route   DELETE /api/v1/categories/:id
// @ access  Private
exports.delete_category = factory.delete_one(Category);
