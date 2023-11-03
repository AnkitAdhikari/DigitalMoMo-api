const { createProduct } = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");

const router = require("express").Router()

router.route('/createProduct').post(isAuthenticated, restrictTo('admin', 'super-admin'), createProduct);

module.exports = router;