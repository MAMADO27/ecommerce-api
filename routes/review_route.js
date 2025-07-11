const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const review_services = require('../services/review_services');
const auth_services = require('../services/auth_services');
const {
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    create_filter_object,
    set_product_user_id
} = require('../services/review_services');
const {
    get_review_validator,
    create_review_validator,
    update_review_validator,
    delete_review_validator
} = require('../utils/validator/review_validator');
const allow_to = require('../middelware/allow_to');
const Router = express.Router({ mergeParams: true });
// Route to get all reviews
router.route('/')
    .get(create_filter_object,get_reviews)
    .post(
        auth_services.protect,
        /*auth_services.*/allow_to('user'),
        create_review_validator,
        set_product_user_id,
        create_review
    );
// Route to get, update, or delete a specific review by ID
router.route('/:id')
    .get(get_review_validator, get_review)
    .put(
        auth_services.protect,
        /*auth_services.*/allow_to('user'),
       update_review_validator,
        update_review
    )
.delete(
    auth_services.protect,
    /*auth_services.*/ allow_to('user', 'admin', 'manager'),
    delete_review_validator,
    delete_review
)


module.exports = router;