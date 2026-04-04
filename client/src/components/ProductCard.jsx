import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import ReviewStars from './ReviewStars';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, wishlist = [], onWishlistChange, hideStars = false }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWished, setIsWished] = useState(wishlist.includes(product._id));


  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error('Please login first');
    try {
      await userAPI.toggleWishlist(product._id);
      setIsWished(!isWished);
      onWishlistChange?.();
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card card" id={`product-${product._id}`}>
      <div className="product-card-image">
        <img src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=Toy'} alt={product.name} />
        {product.featured && <span className="badge badge-featured" style={{ left: 'auto', right: '0.75rem' }}>Featured</span>}
        <button className={`wishlist-btn ${isWished ? 'wished' : ''}`} onClick={handleWishlist}>
          {isWished ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        {!hideStars && <ReviewStars rating={product.rating} count={product.numReviews} />}
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-current">₹{product.price.toFixed(0)}</span>
          </div>
          <button className="btn btn-primary btn-sm add-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
            <FaShoppingCart />
          </button>
        </div>
        {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>
    </Link>
  );
};

export default ProductCard;
