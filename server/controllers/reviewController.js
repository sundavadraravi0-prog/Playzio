const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { product, rating, comment } = req.body;

    // Check if user already reviewed this product
    const existing = await Review.findOne({ user: req.user._id, product });
    if (existing) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment
    });

    // Update product rating
    const reviews = await Review.find({ product });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(product, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length
    });

    const populated = await review.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:id
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getProductReviews };
