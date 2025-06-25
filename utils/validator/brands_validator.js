const { check, body } = require('express-validator');
const validator_middelware = require('../../middelware/validator_middelware');
const { default: slugify } = require('slugify');

exports.get_brand_validator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validator_middelware,
];

exports.create_brand_validator = [
    check('name')
        .notEmpty().withMessage('Brand name is required')
        .isLength({ min: 3 }).withMessage('Brand name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Brand name must be at most 50 characters long')
        .custom((val,{req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validator_middelware
];


exports.update_brand_validator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    body('name').optional().custom((val,{req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validator_middelware,
];



exports.delete_brand_validator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validator_middelware,
];





