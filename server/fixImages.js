const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    let updatedCount = 0;

    for (const p of products) {
      let changed = false;
      const newImages = p.images.map(img => {
        if (img.includes('via.placeholder.com')) {
          changed = true;
          return `https://placehold.co/400x400/8b5cf6/ffffff?text=${encodeURIComponent(p.name)}`;
        }
        return img;
      });

      if (changed) {
        p.images = newImages;
        await p.save();
        updatedCount++;
      }
    }

    console.log(`Successfully fixed images for ${updatedCount} products!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixImages();
