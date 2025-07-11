const { check, body } = require('express-validator');
const validator_middelware = require('../../middelware/validator_middelware');
const { default: slugify } = require('slugify');
const user_model = require('../../modules/user_module');
const bcrypt = require('bcryptjs');



exports.create_user_validator = [
    check('name')
        .notEmpty().withMessage('User name is required')
        .isLength({ min: 3 }).withMessage('User name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('User name must be at most 50 characters long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    // Validate email
    check('email').notEmpty().withMessage('email is required').isEmail().withMessage('Please provide a valid email address').custom((val) => 
    user_model.findOne({ email: val }).then(user => {
        if (user) {
            return Promise.reject(new Error('Email already in use'));
        }
    }),
    ),
    // Validate password
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom((value,{req}) => {
            if(value !== req.body.confirm_password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        // Validate confirm password
        check('confirm_password')
        .notEmpty().withMessage('Confirm Password is required'),
    // Validate phone
    check('phone')
        .optional()
        .isMobilePhone().withMessage('Please provide a valid phone number'),
    // Validate profile image
    check('profile_image')
        .optional()
        .isURL().withMessage('Please provide a valid URL for the profile image'),
    validator_middelware
];

exports.get_user_validator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),
    validator_middelware,
];

exports.update_user_validator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validator_middelware,
];

// Validator for changing user password
exports.change_user_password_validator = [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('confirm_password').notEmpty().withMessage('Confirm password is required'),
  body('password').notEmpty().withMessage('Password is required').custom(async (value, { req }) => {
    const userId = req.user ? req.user._id : req.params.id;

    const user = await user_model.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (req.body.current_password) {
      const isMatch = await bcrypt.compare(req.body.current_password, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
    }

    if (value !== req.body.confirm_password) {
      throw new Error('Password confirmation does not match password');
    }

    return true;
  }),
  validator_middelware
];


exports.delete_user_validator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),
    validator_middelware,
];


