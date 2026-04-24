const Bill = require('../models/Bill');

// @desc    Get user's bills
// @route   GET /api/bills
const getMyBills = async (req, res, next) => {
  try {
    const bills = await Bill.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
const getBill = async (req, res, next) => {
  try {
    // Attempt to find by Bill ID first
    let bill = await Bill.findById(req.params.id).populate('order');
    
    // If not found, attempt to find by Order ID
    if (!bill) {
      bill = await Bill.findOne({ order: req.params.id }).populate('order');
    }

    if (!bill) {
      res.status(404);
      throw new Error('Bill not found');
    }

    // Ensure user can only see their own bills (unless admin)
    if (bill.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this bill');
    }

    res.json(bill);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyBills, getBill };
