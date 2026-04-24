import { useState, useEffect } from 'react';
import { FaBox, FaShoppingBag, FaUsers, FaRupeeSign, FaPlus, FaEdit, FaTrash, FaTimes, FaPrint } from 'react-icons/fa';
import { adminAPI } from '../services/api';
import ReviewStars from '../components/ReviewStars';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const CATEGORIES = ['Action Figures', 'Board Games', 'Building Blocks', 'Dolls', 'Educational', 'Outdoor', 'Puzzles', 'Vehicles', 'Arts & Crafts', 'Stuffed Animals'];
const emptyProduct = { name: '', description: '', price: '', comparePrice: '', category: 'Action Figures', ageRange: { min: 3, max: 12 }, brand: '', stock: '', images: [''], featured: false };

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const { data } = await adminAPI.getStats();
        setStats(data);
      } else if (activeTab === 'products') {
        const { data } = await adminAPI.getStats();
        setStats(data);
        // Use the product API to get all
        const res = await fetch('/api/products?limit=100');
        const d = await res.json();
        setProducts(d.products || []);
      } else if (activeTab === 'orders') {
        const { data } = await adminAPI.getAllOrders();
        setOrders(data);
      } else if (activeTab === 'reviews') {
        const { data } = await adminAPI.getAllReviews();
        setReviews(data);
      } else if (activeTab === 'users') {
        const { data } = await adminAPI.getAllUsers();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openAddProduct = () => {
    setEditProduct(null);
    setProductForm(emptyProduct);
    setShowModal(true);
  };

  const openEditProduct = (product) => {
    setEditProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || '',
      category: product.category,
      ageRange: product.ageRange || { min: 3, max: 12 },
      brand: product.brand || '',
      stock: product.stock,
      images: product.images?.length ? product.images : [''],
      featured: product.featured || false
    });
    setShowModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        comparePrice: Number(productForm.comparePrice) || 0,
        stock: Number(productForm.stock),
        ageRange: { min: Number(productForm.ageRange.min), max: Number(productForm.ageRange.max) },
        images: productForm.images.filter(i => i.trim())
      };
      if (editProduct) {
        await adminAPI.updateProduct(editProduct._id, payload);
        toast.success('Product updated');
      } else {
        await adminAPI.addProduct(payload);
        toast.success('Product added');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminAPI.deleteReview(id);
      setReviews(reviews.filter(r => r._id !== id));
      toast.success('Review deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page" id="admin-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
        </div>

        <div className="tabs">
          {['stats', 'products', 'orders', 'reviews', 'users'].map(tab => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {/* Stats Tab */}
            {activeTab === 'stats' && stats && (
              <div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-card-label">Total Products</div><div className="stat-card-value"><FaBox style={{ fontSize: '1rem', color: 'var(--primary)' }} /> {stats.totalProducts}</div></div>
                  <div className="stat-card"><div className="stat-card-label">Total Orders</div><div className="stat-card-value"><FaShoppingBag style={{ fontSize: '1rem', color: 'var(--accent-orange)' }} /> {stats.totalOrders}</div></div>
                  <div className="stat-card"><div className="stat-card-label">Total Users</div><div className="stat-card-value"><FaUsers style={{ fontSize: '1rem', color: 'var(--accent-teal)' }} /> {stats.totalUsers}</div></div>
                  <div className="stat-card"><div className="stat-card-label">Total Revenue</div><div className="stat-card-value"><FaRupeeSign style={{ fontSize: '1rem', color: 'var(--accent-pink)' }} /> {stats.totalRevenue?.toFixed(0)}</div></div>
                </div>
                {stats.recentOrders?.length > 0 && (
                  <div>
                    <h3 style={{ marginBottom: '1rem' }}>Recent Orders</h3>
                    <div className="table-container">
                      <table className="table">
                        <thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                          {stats.recentOrders.map(order => (
                            <tr key={order._id}>
                              <td>{order.invoiceNumber || `#${order._id.slice(-8).toUpperCase()}`}</td>
                              <td>{order.user?.name || 'N/A'}</td>
                              <td><strong>₹{(order.totalAmount || order.totalPrice).toFixed(0)}</strong></td>
                              <td><span className={`badge badge-status badge-${order.status}`}>{order.status}</span></td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button className="btn btn-primary" onClick={openAddProduct} id="add-product-btn"><FaPlus /> Add Product</button>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td><img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} /></td>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td>{p.category}</td>
                          <td>₹{p.price.toFixed(0)}</td>
                          <td>{p.stock}</td>
                          <td>{p.featured ? 'Yes' : '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEditProduct(p)}><FaEdit /></button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p._id)}><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Invoice</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>{order.invoiceNumber || `#${order._id.slice(-8).toUpperCase()}`}<br /><small style={{ color: 'var(--gray-400)' }}>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                        <td>{order.user?.name || 'N/A'}<br /><small style={{ color: 'var(--gray-400)' }}>{order.user?.email}</small></td>
                        <td>{order.items.length} items</td>
                        <td><strong>₹{(order.totalAmount || order.totalPrice).toFixed(0)}</strong></td>
                        <td>
                          <select className="form-select" style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} value={order.status} onChange={e => handleOrderStatus(order._id, e.target.value)}>
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a href={`/order/invoice/${order._id}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" title="View Invoice">
                              <FaPrint />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>User</th><th>Product</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review._id}>
                        <td>{review.user?.name || 'N/A'}</td>
                        <td>{review.product?.name || 'N/A'}</td>
                        <td><ReviewStars rating={review.rating} size="0.75rem" /></td>
                        <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.comment}</td>
                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(review._id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-featured' : 'badge-new'}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Product Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="modal-title" style={{ margin: 0 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', color: 'var(--gray-400)', cursor: 'pointer' }}><FaTimes /></button>
              </div>
              <form onSubmit={handleProductSubmit}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Price (₹)</label><input type="number" step="0.01" className="form-input" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required /></div>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Compare Price (₹)</label><input type="number" step="0.01" className="form-input" value={productForm.comparePrice} onChange={e => setProductForm({...productForm, comparePrice: e.target.value})} /></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Category</label><select className="form-select" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Stock</label><input type="number" className="form-input" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required /></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Brand</label><input className="form-input" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} /></div>
                  <div className="form-group" style={{ flex: 0.5 }}><label className="form-label">Min Age</label><input type="number" className="form-input" value={productForm.ageRange.min} onChange={e => setProductForm({...productForm, ageRange: {...productForm.ageRange, min: e.target.value}})} /></div>
                  <div className="form-group" style={{ flex: 0.5 }}><label className="form-label">Max Age</label><input type="number" className="form-input" value={productForm.ageRange.max} onChange={e => setProductForm({...productForm, ageRange: {...productForm.ageRange, max: e.target.value}})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={productForm.images[0]} onChange={e => setProductForm({...productForm, images: [e.target.value]})} placeholder="https://..." /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="featured-check" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} />
                  <label htmlFor="featured-check" style={{ margin: 0, cursor: 'pointer' }}>Featured Product</label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editProduct ? 'Save Changes' : 'Add Product')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
