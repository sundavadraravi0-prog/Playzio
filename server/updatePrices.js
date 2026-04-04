const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updatePrices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    for (const p of products) {
      if (p.price < 500) { // If price is still in USD scale
        p.price = Math.round(p.price * 80);
        if (p.comparePrice) p.comparePrice = Math.round(p.comparePrice * 80);
        await p.save();
      }
    }
    console.log(`Updated ${products.length} products to INR scale`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updatePrices();
