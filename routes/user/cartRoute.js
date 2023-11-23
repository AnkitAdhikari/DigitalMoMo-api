const { addToCart, getMyCartItems, deleteCartItem } = require('../../controller/user/cart/cartController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const catchAsync = require('../../services/catchAsync');

const router = require('express').Router();

router.route("/").get(isAuthenticated, getMyCartItems);
router.route("/:productId").post(isAuthenticated, catchAsync(addToCart)).delete(isAuthenticated, catchAsync(deleteCartItem));

module.exports = router;