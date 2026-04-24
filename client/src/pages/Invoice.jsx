import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPrint, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { billAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Invoice.css';

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const { data } = await billAPI.getOne(id);
        setBill(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id]);

  if (loading) return <div className="page"><LoadingSpinner /></div>;
  if (!bill) return <div className="page"><div className="container">Bill not found</div></div>;

  const subtotal = bill.subtotal || 0;
  const shipping = bill.shippingPrice || 0;
  const tax = bill.taxPrice || 0;
  const totalAmount = bill.totalAmount || (subtotal + shipping);

  return (
    <div className="page invoice-page">
      <div className="container no-print">
        <div className="invoice-actions">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <FaArrowLeft /> Back
          </button>
          <button onClick={() => window.print()} className="btn btn-primary">
            <FaPrint /> Print Invoice
          </button>
        </div>
      </div>

      <div className="invoice-container card">
        <div className="invoice-header">
          <div className="invoice-logo">
            <span className="logo-text">Playzio</span>
            <p>Playzio Toy Store</p>
          </div>
          <div className="invoice-meta">
            <h1>INVOICE</h1>
            <p><strong>Invoice No:</strong> {bill.billNumber}</p>
            <p><strong>Order ID:</strong> #{(bill.order?._id || bill.order || bill._id).toString().slice(-8).toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="invoice-info">
          <div className="bill-to">
            <h3>Bill To</h3>
            <p><strong>{bill.customerDetails?.name || 'Customer'}</strong></p>
            <p>{bill.billingAddress?.street}</p>
            <p>{bill.billingAddress?.city}, {bill.billingAddress?.state} {bill.billingAddress?.zip}</p>
            <p>{bill.billingAddress?.country}</p>
            <p>{bill.customerDetails?.email}</p>
          </div>
          <div className="order-status-info" style={{ textAlign: 'right' }}>
            <h3>Payment Status</h3>
            <div className="status-badge-invoice">
              <FaCheckCircle /> {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <strong>Method:</strong> {bill.paymentMethod}
            </p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {(bill.items?.length > 0 ? bill.items : (bill.order?.items || [])).map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>₹{item.price.toFixed(0)}</td>
                <td style={{ textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          {tax > 0 && (
            <div className="summary-row">
              <span>Tax (GST 18%):</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
          </div>
          <div className="summary-row grand-total">
            <span>Grand Total:</span>
            <span>₹{totalAmount.toFixed(0)}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Thank you for choosing Playzio! We hope your toys bring lots of joy.</p>
          <div className="footer-small">
            <p>Playzio Toy Store, 7 Toy Lane, Fun City</p>
            <p>www.playzio.com | hello@playzio.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
