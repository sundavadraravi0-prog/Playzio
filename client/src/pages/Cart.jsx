import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag, FaSignInAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, loading } = useCart();
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return (
      <div className="page" id="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '4rem' }}>
            <div className="empty-state-icon">🔒</div>
            <h3 className="empty-state-title">Login to view your cart</h3>
            <p className="empty-state-text">Please login or create an account to start adding items to your cart.</p>
            <Link to="/login" className="btn btn-primary"><FaSignInAlt /> Login</Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="page" id="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '4rem' }}>
            <h3 className="empty-state-title">Loading your cart...</h3>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="page" id="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '4rem' }}>
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-text">Looks like you haven't added any toys yet!</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping <FaArrowRight /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" id="cart-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item card" id={`cart-item-${item._id}`}>
                <div className="cart-item-image">
                  <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-price">₹{item.price.toFixed(0)}</span>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><FaMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}><FaPlus /></button>
                </div>
                <div className="cart-item-total">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}><FaTrash /></button>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{totalPrice >= 4000 ? 'Free' : '₹499'}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(totalPrice >= 4000 ? totalPrice : totalPrice + 499).toFixed(0)}</span>
            </div>
            {totalPrice < 50 && (
              <p className="free-shipping-note">Add ₹{(4000 - totalPrice).toFixed(0)} more for free shipping</p>
            )}
            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} id="checkout-btn">
              <FaShoppingBag /> Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
