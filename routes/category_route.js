const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { param, validationResult } = require('express-validator');

const { get_category_validator ,create_category_validator,update_category_validator,delete_category_validator} = require('../utils/validator/category_validator');
const { getcategories, getcategory, create_category, update_category, delete_category ,uploud_category_image,resize_category_image} = require('../services/category_services');
const auth_services = require('../services/auth_services');
const { getcategory_validator } = require('../utils/validator/category_validator');
const sub_categories_route = require('./sub_category_route');
const allow_to = require('../middelware/allow_to');
router.use('/:categoryId/Subcategories', sub_categories_route);

router.route('/').get(getcategories).post(auth_services.protect,
    /*auth_services.*/allow_to('admin','manager'),
    uploud_category_image,resize_category_image
,create_category_validator,create_category);


router.route('/:id')
.get(get_category_validator,getcategory)
.put(auth_services.protect,
   /* auth_services.*/allow_to('admin','manager'),
    uploud_category_image,resize_category_image,
    update_category_validator,update_category)
.delete(auth_services.protect,
   /* auth_services.*/allow_to('admin'),
    delete_category_validator,delete_category);

module.exports = router;



 




