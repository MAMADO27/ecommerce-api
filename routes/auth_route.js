const express = require('express');
const {
  sign_up_Validator,
  login_Validator,
} = require('../utils/validator/auth_validator');
const auth_services = require('../services/auth_services');
const {
  signup,
  login,
  forget_password,
  verify_reset_code,
  reset_password,
} = require('../services/auth_services');

const router = express.Router();

router.route('/signup').post(sign_up_Validator, signup);
router.route('/login').post(login_Validator, login);
router.route('/forgote_password').post(auth_services.forget_password);
router.route('/verify_reset_code').post(auth_services.verify_reset_code);
router.route('/reset_password').put(auth_services.reset_password);

module.exports = router;