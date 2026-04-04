import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await userAPI.getWishlist();
      setProducts(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, []);

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page" id="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Wishlist</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>{products.length} items saved</p>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💝</div>
            <h3 className="empty-state-title">Your wishlist is empty</h3>
            <p className="empty-state-text">Browse toys and tap the heart to save your favorites!</p>
            <Link to="/shop" className="btn btn-primary">Browse Toys</Link>
          </div>
        ) : (
          <div className="grid-products">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                wishlist={products.map(p => p._id)}
                onWishlistChange={fetchWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
