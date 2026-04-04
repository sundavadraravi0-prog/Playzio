import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { productAPI, reviewAPI, userAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ReviewStars from '../components/ReviewStars';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          productAPI.getOne(id),
          reviewAPI.getByProduct(id)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
        if (user) {
          try {
            const { data } = await userAPI.getWishlist();
            setIsWished(data.some(p => p._id === id));
          } catch {}
        }
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    try {
      await userAPI.toggleWishlist(id);
      setIsWished(!isWished);
      toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      const { data } = await reviewAPI.create({ product: id, ...reviewForm });
      setReviews([data, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      // Refetch product for updated rating
      const { data: updated } = await productAPI.getOne(id);
      setProduct(updated);
      toast.success('Review submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><LoadingSpinner /></div>;
  if (!product) return <div className="page"><div className="container"><div className="empty-state"><h3 className="empty-state-title">Product not found</h3></div></div></div>;



  return (
    <div className="page" id="product-detail-page">
      <div className="container">
        <Link to="/shop" className="back-link"><FaArrowLeft /> Back to Shop</Link>

        <div className="product-detail">
          <div className="product-images">
            <div className="product-main-image">
              <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} />
            </div>
          </div>

          <div className="product-info">
            <span className="product-category-tag">{product.category}</span>
            <h1 className="product-name">{product.name}</h1>
            <ReviewStars rating={product.rating} count={product.numReviews} size="1.1rem" />
            
            <div className="product-pricing">
              <span className="product-price">₹{product.price.toFixed(0)}</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              <div className="meta-item"><span className="meta-label">Brand:</span> {product.brand || 'N/A'}</div>
              <div className="meta-item"><span className="meta-label">Age:</span> {product.ageRange?.min}-{product.ageRange?.max} years</div>
              <div className="meta-item"><span className="meta-label">Stock:</span> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FaMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><FaPlus /></button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => addToCart(product, quantity)} disabled={product.stock === 0} id="add-to-cart-btn">
                <FaShoppingCart /> Add to Cart
              </button>
              <button className={`btn btn-secondary wishlist-action ${isWished ? 'wished' : ''}`} onClick={handleWishlist}>
                {isWished ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2 className="section-title">Customer Reviews</h2>

          {user && (
            <form className="review-form card" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea className="form-input" value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your thoughts..." required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first to leave one.</p>
            ) : reviews.map(review => (
              <div key={review._id} className="review-card card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="review-avatar">{review.user?.name?.charAt(0) || '?'}</div>
                    <div>
                      <strong>{review.user?.name}</strong>
                      <ReviewStars rating={review.rating} size="0.8rem" />
                    </div>
                  </div>
                  <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
