const slugify = require('slugify');
const { check, body } = require('express-validator');
const validator_middelware = require('../../middelware/validator_middelware');
const Category = require('../../modules/category_module');
const SubCategory = require('../../modules/sub_category_model');

exports.create_product_validator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 chars')
    .notEmpty()
    .withMessage('Product title is required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product sold must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number'),
  check('price_after_discount')
    .notEmpty()
    .withMessage('Product price_after_discount is required')
    .isNumeric()
    .withMessage('Product price_after_discount must be a number')
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('price_after_discount must be lower than price');
      }
      return true;
    }),
  check('colors')
    .optional()
    .isArray()
    .withMessage('colors should be array of string'),
  check('image_cover')
    .notEmpty()
    .withMessage('Product image_cover is required'),
  check('image')
    .optional()
    .isArray()
    .withMessage('image should be array of string'),
  check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId()
    .withMessage('Invalid Category ID Format')
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check('sub_category')
    .notEmpty()
    .withMessage('Product must belong to a sub category')
    .isMongoId()
    .withMessage('Invalid SubCategory ID Format')
    .custom((subCategoryId, { req }) =>
      SubCategory.findOne({ _id: subCategoryId, category: req.body.category }).then((subCategory) => {
        if (!subCategory) {
          return Promise.reject(
            new Error(`SubCategory does not belong to the selected category`)
          );
        }
      })
    ),
  check('brand')
    .notEmpty()
    .withMessage('Product must belong to a brand')
    .isMongoId()
    .withMessage('Invalid Brand ID Format'),
  check('rating')
    .optional()
    .isNumeric()
    .withMessage('rating must be a number')
    .isFloat({ min: 0, max: 5 })
    .withMessage('rating must be between 0 and 5'),
  check('rating_quantity')
    .optional()
    .isNumeric()
    .withMessage('rating_quantity must be a number'),
  validator_middelware,
];

exports.get_product_validator = [
  check('id').isMongoId().withMessage('Invalid Product ID Format'),
  
  validator_middelware,
];

exports.update_product_validator = [
  check('id').isMongoId().withMessage('Invalid Product ID Format'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator_middelware,
];

exports.delete_product_validator = [
  check('id').isMongoId().withMessage('Invalid Product ID Format'),
  validator_middelware,
];