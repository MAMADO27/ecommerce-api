const { check, body } = require('express-validator');
const validator_middelware = require('../../middelware/validator_middelware');
const { default: slugify } = require('slugify');
const user_model = require('../../modules/user_module');
const bcrypt = require('bcryptjs');


exports.sign_up_Validator = [
    check('name')
        .notEmpty().withMessage('User name is required')
        .isLength({ min: 3 }).withMessage('User name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('User name must be at most 50 characters long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .custom((val) =>
            user_model.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject(new Error('Email already in use'));
                }
            })
        ),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.confirm_password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    check('confirm_password')
        .notEmpty().withMessage('Confirm Password is required'),
    check('phone')
        .optional()
        .isMobilePhone().withMessage('Please provide a valid phone number'),
    check('profile_image')
        .optional()
        .isURL().withMessage('Please provide a valid URL for the profile image'),
    validator_middelware
];

exports.login_Validator = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    check('password')
        .notEmpty().withMessage('Password is required'),
    validator_middelware
];
