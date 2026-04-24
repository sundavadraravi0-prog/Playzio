const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyBills, getBill } = require('../controllers/billController');

router.get('/', protect, getMyBills);
router.get('/:id', protect, getBill);

module.exports = router;
