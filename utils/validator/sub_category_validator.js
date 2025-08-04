const slugify = require('slugify');
const { check ,body} = require('express-validator');
const validator_middelware = require('../../middelware/validator_middelware');

const { param } = require('express-validator');


exports.category_id_validator = [
    param('categoryId').isMongoId().withMessage('Invalid Category ID Format'),
    validator_middelware
];
exports.get_sub_category_validator = [ check('id').isMongoId().withMessage("Invalid sub_category ID Format"),
validator_middelware,
];

exports.create_sub_category_validator = [
    check('name').notEmpty().withMessage('sub_Category name is required').isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long').isLength({ max: 32 }).withMessage('Category name must be at most 32 characters long'),
    check('category').notEmpty().withMessage('sub category required').isMongoId().withMessage('Invalid Category ID Format')  
     .custom((val,{req})=>{
        req.body.slug = slugify(val)
        return true;
    })
    ,validator_middelware];


exports.update_sub_category_validator = [check('id').isMongoId().withMessage("Invalid sub_Category ID Format"),
        body('name').custom((val,{req})=>{
            req.body.slug = slugify(val)
            return true;
        }),
validator_middelware
];

exports.delete_sub_category_validator = [check('id').isMongoId().withMessage("Invalid sub_Category ID Format"),validator_middelware];
