import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page" id="login-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <h2>Welcome Back</h2>
            <p>Sign in to continue shopping and track your orders.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required id="login-email" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required id="login-password" />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="login-submit">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>

            <div className="demo-credentials" style={{ marginTop: '20px', padding: '15px', background: 'var(--surface-color, rgba(108, 92, 231, 0.1))', border: '1px solid var(--border-color, rgba(108, 92, 231, 0.2))', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary-color)' }}>Demo Admin Account</p>
              <p style={{ margin: '5px 0 0', color: 'var(--text-color, #333)' }}>Email: <strong>abc@gmail.com</strong></p>
              <p style={{ margin: '2px 0 0', color: 'var(--text-color, #333)' }}>Password: <strong>abc123</strong></p>
              <button
                type="button"
                onClick={() => setForm({ email: 'abc@gmail.com', password: 'abc123' })}
                style={{ marginTop: '10px', padding: '5px 15px', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary-color)'; }}
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
