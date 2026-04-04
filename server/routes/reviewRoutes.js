const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReview, getProductReviews } = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/product/:id', getProductReviews);

module.exports = router;
