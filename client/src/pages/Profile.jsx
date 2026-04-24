import { useState, useEffect } from 'react';
import { FaUser, FaSave, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: { street: '', city: '', state: '', zip: '', country: '' } });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await userAPI.getProfile();
        setProfile({ name: data.name, email: data.email, phone: data.phone || '', address: data.address || {} });
      } catch {}
    };
    fetch();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await userAPI.updateProfile({ name: profile.name, phone: profile.phone, address: profile.address });
      updateUser({ name: data.name });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setLoadingPw(true);
    try {
      await userAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoadingPw(false);
    }
  };

  return (
    <div className="page" id="profile-page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
        </div>

        <div className="profile-header card">
          <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
          <div>
            <h2>{user?.name}</h2>
            <p style={{ color: 'var(--gray-500)' }}>{user?.email}</p>
            {user?.role === 'admin' && <span className="badge badge-featured">Admin</span>}
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <FaUser style={{ marginRight: '0.4rem' }} /> Profile
          </button>
          <button className={`tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
            <FaLock style={{ marginRight: '0.4rem' }} /> Password
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form className="card" style={{ padding: '1.5rem' }} onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={profile.email} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Your phone number" />
            </div>
            <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem' }}>Shipping Address</h3>
            <div className="form-group">
              <label className="form-label">Street</label>
              <input className="form-input" value={profile.address.street || ''} onChange={e => setProfile({...profile, address: {...profile.address, street: e.target.value}})} />
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">City</label><input className="form-input" value={profile.address.city || ''} onChange={e => setProfile({...profile, address: {...profile.address, city: e.target.value}})} /></div>
              <div className="form-group"><label className="form-label">State</label><input className="form-input" value={profile.address.state || ''} onChange={e => setProfile({...profile, address: {...profile.address, state: e.target.value}})} /></div>
            </div>
            <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP</label>
                  <input 
                    className="form-input" 
                    value={profile.address.zip || ''} 
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({...profile, address: {...profile.address, zip: value}});
                    }} 
                  />
                </div>
              <div className="form-group"><label className="form-label">Country</label><input className="form-input" value={profile.address.country || ''} onChange={e => setProfile({...profile, address: {...profile.address, country: e.target.value}})} /></div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loadingProfile}><FaSave /> {loadingProfile ? 'Saving...' : 'Save Changes'}</button>
          </form>
        ) : (
          <form className="card" style={{ padding: '1.5rem' }} onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loadingPw}><FaLock /> {loadingPw ? 'Updating...' : 'Change Password'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
