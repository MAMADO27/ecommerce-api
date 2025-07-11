var slugify = require('slugify'); 
const Brand = require('../modules/brands_module'); 
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');
const mongoose = require('mongoose');
const {upload_single_image} = require('../middelware/uploud_image_midelware');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');


exports.uploud_brand_image = upload_single_image('image'); // Use the middleware to handle image upload

exports.resize_brand_image = async (req, res, next) => {
    if (!req.file) return next();
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/brands/${filename}`);
    req.body.image = filename;
    next();
};

// @ desc    Get all brands
// @ route   GET /api/v1/brands
// @ access  Public
exports.get_brands = factory.get_all(Brand, 'brands');

// @ desc    Get a single brand
// @ route   GET /api/v1/brands/:id
// @ access  Public
exports.get_brand = factory.get_one(Brand);
// @ desc    Create a new brand
// @ route   POST /api/v1/brands
// @ access  Private
exports.create_brand = factory.create_one(Brand);

// @ desc    Update a brand
// @ route   PUT /api/v1/brands/:id
// @ access  Private
exports.update_brand = factory.update_one(Brand);
// @ desc    Delete a brand
// @ route   DELETE /api/v1/brands/:id
// @ access  Private
exports.delete_brand = factory.delete_one(Brand);
