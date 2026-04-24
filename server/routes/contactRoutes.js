const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitContact } = require('../controllers/contactController');

router.post('/', protect, submitContact);

module.exports = router;
