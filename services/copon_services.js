const Copon = require('../modules/copon_module');
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');

// @ desc    Get all copons
// @ route   GET /api/v1/copons
// @ access  private

exports.get_copons = factory.get_all(Copon, 'copons');

// @ desc    Get a single Copon
// @ route   GET /api/v1/copons/:id
// @ access  private

exports.get_copon = factory.get_one(Copon);
// @ desc    Create a new Copon
// @ route   POST /api/v1/copons
// @ access  Private
exports.create_copon = factory.create_one(Copon);

// @ desc    Update a Copon
// @ route   PUT /api/v1/copons/:id
// @ access  Private
exports.update_copon = factory.update_one(Copon);
// @ desc    Delete a Copon
// @ route   DELETE /api/v1/copons/:id
// @ access  Private
exports.delete_copon = factory.delete_one(Copon);