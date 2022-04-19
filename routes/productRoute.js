const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");

const { getSingleProductReviews } = require("../controller/reviewController");

const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  UpdateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");

router
  .route("/")
  .post([authenticateUser, authorizePermission("admin")], createProduct)
  .get(getAllProduct);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermission("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission("admin")], UpdateProduct)
  .delete([authenticateUser, authorizePermission("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
