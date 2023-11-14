const { createProduct, deleteProduct, editProduct } = require("../../controller/admin/product/productController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");

const router = require("express").Router()
const { multer, storage } = require('../../middleware/multerConfig');
const catchAsync = require("../../services/catchAsync");
const { getProduct, getProducts } = require("../../controller/global/globalController");

const upload = multer({ storage: storage })

router.route('/createProduct').post(isAuthenticated, restrictTo('admin', 'super-admin'), upload.single('productImage'), catchAsync(createProduct));


router.route('/').get(catchAsync(getProducts))

router.route('/:id')
  .get(catchAsync(getProduct))
  .delete(isAuthenticated, restrictTo('admin', 'super-admin'), catchAsync(deleteProduct))
  .patch(isAuthenticated, restrictTo('admin', 'super-admin'), upload.single('productImage'), catchAsync(editProduct))

module.exports = router;