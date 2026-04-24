import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { FaCheckCircle, FaPrint } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { items, totalPrice, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [successOrder, setSuccessOrder] = useState(null);

  const shipping = totalPrice >= 4000 ? 0 : 499;
  const total = totalPrice + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await orderAPI.create({
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod
      });
      setSuccessOrder(data);
      // Server clears the cart, re-fetch to sync frontend
      await fetchCart();
      toast.success('Order placed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (items.length === 0 && !successOrder)) {
    navigate('/cart');
    return null;
  }

  if (successOrder) {
    return (
      <div className="page" id="order-success">
        <div className="container order-success-container">
          <div className="card animate-slideDown success-card">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h1 className="page-title success-title">Order Placed!</h1>
            <p className="success-text">
              Thank you for your purchase! Your order <strong>#{successOrder.order._id.slice(-8).toUpperCase()}</strong> has been successfully placed.
            </p>
            <div className="success-actions">
              <Link to={`/order/invoice/${successOrder.bill._id}`} className="btn btn-primary btn-lg">
                <FaPrint /> View & Download Bill
              </Link>
              <Link to="/orders" className="btn btn-secondary">
                View All Orders
              </Link>
              <Link to="/" className="btn btn-sm continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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
                  <input 
                    className="form-input" 
                    value={address.zip} 
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      setAddress({...address, zip: value});
                    }} 
                    required 
                    id="checkout-zip" 
                    placeholder="12345" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} required id="checkout-country" placeholder="Country" />
                </div>
              </div>
            </div>
            
            <div className="checkout-section card" style={{ marginTop: '1.5rem' }}>
              <h2>Payment Method</h2>
              <div className="form-group">
                <select className="form-input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="Credit Card">Credit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
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
