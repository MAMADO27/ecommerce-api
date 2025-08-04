const express = require('express');
const auth_services = require('../services/auth_services');

const router = express.Router({ mergeParams: true });
const {
  create_sub_category,
  get_sub_category,
  get_sub_categories,
  update_sub_category,
  delete_sub_category,
  set_categoryId_to_body
} = require('../services/sub_category_services');
const {
  create_sub_category_validator,
  get_sub_category_validator,
  update_sub_category_validator,
  delete_sub_category_validator,
  category_id_validator
} = require('../utils/validator/sub_category_validator');
const allow_to = require('../middelware/allow_to');
router.route('/')
  .post(auth_services.protect,
    allow_to('admin', 'manager'),
    set_categoryId_to_body,category_id_validator, ...create_sub_category_validator, create_sub_category)
  .get( get_sub_categories);

router.route('/:id')
  .get(get_sub_category_validator, get_sub_category)
  .put(auth_services.protect,
    allow_to('admin', 'manager'),
    update_sub_category_validator, update_sub_category)
  .delete(auth_services.protect,
    allow_to('admin'),
    delete_sub_category_validator, delete_sub_category);

module.exports = router;

