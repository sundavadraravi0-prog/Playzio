import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Orders.css';

const statusColors = {
  pending: 'badge-pending',
  processing: 'badge-processing',
  shipped: 'badge-shipped',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await orderAPI.getAll();
        setOrders(data);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page" id="orders-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-text">When you place your first order, it will appear here.</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card card" id={`order-${order._id}`}>
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <span className={`badge badge-status ${statusColors[order.status]}`}>{order.status}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} />
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">×{item.quantity}</span>
                      <span className="order-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">Total: <strong>₹{order.totalPrice.toFixed(0)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
