const slugify = require('slugify');
const { check ,body } = require('express-validator');
const validator_middelware = require('../../middelware/validator_middelware');

exports.get_category_validator = [ check('id').isMongoId().withMessage("Invalid Category ID Format"),
validator_middelware,
];

exports.create_category_validator = [
    check('name').notEmpty().withMessage('Category name is required').isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long').isLength({ max: 50 }).withMessage('Category name must be at most 50 characters long')
    .custom((val,{req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validator_middelware];


exports.update_category_validator = [check('id').isMongoId().withMessage("Invalid Category ID Format"),
        body('name').optional().custom((val,{req})=>{
            req.body.slug = slugify(val)
            return true;
        }),
validator_middelware,
];

exports.delete_category_validator = [check('id').isMongoId().withMessage("Invalid Category ID Format"),];



