import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page" id="register-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <h2>Welcome to Playzio</h2>
            <p>Create an account to start shopping and save your favorites.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Start your toy shopping journey</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <input type="text" className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="register-name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required id="register-email" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="register-password" />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input type="password" className="form-input" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required id="register-confirm" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="register-submit">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
