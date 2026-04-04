import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { items, totalPrice, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: '' });

  const shipping = totalPrice >= 4000 ? 0 : 499;
  const total = totalPrice + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await orderAPI.create({
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: address
      });
      // Server clears the cart, re-fetch to sync frontend
      await fetchCart();
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user || items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page" id="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-form">
            <div className="checkout-section card">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required id="checkout-street" placeholder="123 Main St" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required id="checkout-city" placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required id="checkout-state" placeholder="State" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input className="form-input" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} required id="checkout-zip" placeholder="12345" />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} required id="checkout-country" placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-summary card">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {items.map(item => (
                <div key={item._id} className="checkout-item">
                  <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{totalPrice.toFixed(0)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading} id="place-order-btn">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
