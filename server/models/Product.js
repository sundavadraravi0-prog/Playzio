const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  comparePrice: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Action Figures', 'Board Games', 'Building Blocks', 'Dolls', 'Educational', 'Outdoor', 'Puzzles', 'Vehicles', 'Arts & Crafts', 'Stuffed Animals']
  },
  ageRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 12 }
  },
  brand: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
