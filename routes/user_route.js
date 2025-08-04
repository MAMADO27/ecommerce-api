const express = require('express');
const router = express.Router();
const auth_services = require('../services/auth_services');
const { param, validationResult } = require('express-validator');
const {
  get_user_validator,
  create_user_validator,
  update_user_validator,
  delete_user_validator,
  change_user_password_validator
} = require('../utils/validator/user_validator');
const {
  get_users,
  get_user,
  create_user,
  update_user,
  delete_user,
  resize_user_image,
  uploud_user_image,
  change_user_password,
  get_my_data,
  change_my_password,
  update_my_data,
  delete_my_account
} = require('../services/user_services');
const { get } = require('mongoose');
const allow_to = require('../middelware/allow_to');
router.route('/:id/change-password')
  .put(change_user_password_validator, 
        
    change_user_password);

router.route('/')
  .get(auth_services.protect,
    allow_to('admin', 'manager'),
    get_users)
  .post(auth_services.protect,
    allow_to('admin', 'manager'),
    uploud_user_image,
    resize_user_image,
    create_user_validator,
    create_user
  );
router.route('/my_data').get(auth_services.protect,get_my_data,get_user);
router.route('/change_my_password')
  .put(auth_services.protect,
    change_user_password_validator, 
    change_my_password);

router.route('/update_my_data')
  .put(auth_services.protect,
    uploud_user_image,
    resize_user_image,
    update_my_data, 
    update_user);

router.route('/delete_me')
  .delete(auth_services.protect,
    delete_my_account);
  
router.route('/:id')
  .get(auth_services.protect,
    allow_to('admin', 'manager'),
    get_user_validator, get_user)
  .put(auth_services.protect,
    allow_to('admin', 'manager'),
    uploud_user_image,
    resize_user_image,
    update_user_validator,
    update_user
  )
  .delete(auth_services.protect,
    allow_to('admin'),
    delete_user_validator, delete_user);


module.exports = router;