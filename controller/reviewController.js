const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error-handlers");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isProductValid = await Product.findOne({ _id: productId });

  if (!isProductValid) {
    throw new CustomError.NotFoundError(`No Product with id: ${productId}`);
  }

  const alreadyComment = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadyComment) {
    throw new CustomError.BadRequestError(
      "You already dropped a comment for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const { comment, rating, title } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.comment = comment;
  review.rating = rating;
  review.title = title;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No Review with id: ${review}`);
  }
  checkPermissions(req.user, review.user);
  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "Review Deleted Successfully" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
