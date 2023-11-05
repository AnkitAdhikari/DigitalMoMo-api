const { createProduct, getProducts, getProduct } = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");

const router = require("express").Router()
const { multer, storage } = require('../middleware/multerConfig');
const catchAsync = require("../services/catchAsync");

const upload = multer({ storage: storage })

router.route('/createProduct').post(isAuthenticated, restrictTo('admin', 'super-admin'), upload.single('productImage'), catchAsync(createProduct));


router.route('/products').get(catchAsync(getProducts))

router.route('/products/:id').get(catchAsync(getProduct))

module.exports = router;