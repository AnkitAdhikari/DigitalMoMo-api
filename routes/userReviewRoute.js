const { getProductReview, createReview, addProductReview } = require('../controller/user/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const catchAsync = require('../services/catchAsync');

const router = require('express').Router();


router.route('/reviews/:id').get(getProductReview).post(isAuthenticated, catchAsync(addProductReview))

module.exports = router