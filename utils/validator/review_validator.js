const { check } = require('express-validator');
const Review = require('../../modules/review_module');
const validator_middelware = require('../../middelware/validator_middelware');

exports.get_review_validator = [
    check('id').isMongoId().withMessage('Invalid review id format'),
    validator_middelware,
];

exports.create_review_validator = [
    check('title').optional().isString().withMessage('Title must be a string'),
    check('rating')
        .exists().withMessage('Rating is required')
        .isNumeric().withMessage('Rating must be a number')
        .isFloat({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5 and float number'),
    check('comment').optional().isString().withMessage('Comment must be a string'),
    check('product')
        .exists().withMessage('Product is required')
        .isMongoId().withMessage('Invalid product id format')
        .custom(async (value, { req }) => {
            const review = await Review.findOne({ user: req.user._id, product: req.body.product });
            if (review) {
                return Promise.reject('You have already reviewed this product');
            }
        }),
    validator_middelware,
];

exports.update_review_validator = [
    check('id').isMongoId().withMessage('Invalid review id format').custom(async (value, { req }) => {
        const review = await Review.findById(value);
        if (!review) {
            return Promise.reject('Review not found');
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject('You can only update your own reviews');
        }
    }),
    check('title').optional().isString().withMessage('Title must be a string'),
    check('rating')
        .optional()
        .isNumeric().withMessage('Rating must be a number')
        .isFloat({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5 and float number'),
    check('comment').optional().isString().withMessage('Comment must be a string'),
    validator_middelware,
];

exports.delete_review_validator = [
    check('id').isMongoId().withMessage('Invalid review id format')
        .custom(async (value, { req }) => {
            if (req.user.role === 'user') {
                const review = await Review.findById(value);
                if (!review) {
                    return Promise.reject('Review not found');
                }
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject('You can only delete your own reviews');
                }
            }
        }),
    validator_middelware
];

