var slugify = require('slugify');
const Product = require('../modules/product_module');
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {upload_single_image, upload_multiple_images} = require('../middelware/uploud_image_midelware');

// Middleware to set the slug for product
exports.Product_image_upload = upload_multiple_images([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);



// Middleware to set the slug for product
exports.Product_image_upload = upload_multiple_images([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

// Middleware to resize product images
exports.resize_product_images = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const image_cover_file_name = `product-cover-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/products/${image_cover_file_name}`);
        req.body.image_cover = image_cover_file_name; 
    }

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
                await sharp(file.buffer)
                    .resize(600, 600)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`uploads/categories/products/${filename}`);
                req.body.images.push(filename);
            })
        );
    }
    next();
});



// @ desc    Get all products
// @ route   GET /api/v1/products
// @ access  Public
exports.get_products = factory.get_all(Product, 'products');

// @ desc    Get a single product
// @ route   GET /api/v1/products/:id
// @ access  Public
exports.get_product = factory.get_one(Product);

// @ desc    Create a new product
// @ route   POST /api/v1/products
// @ access  Private
exports.create_product = factory.create_one(Product);

// @ desc    Update a product
// @ route   PUT /api/v1/products/:id
// @ access  Private
exports.update_product = factory.update_one(Product);

// @ desc    Delete a product
// @ route   DELETE /api/v1/products/:id
// @ access  Private
exports.delete_product = factory.delete_one(Product);