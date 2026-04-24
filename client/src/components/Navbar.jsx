import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaSearch, FaSignOutAlt, FaCrown, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <img src="/playzio-logo.png" alt="Playzio Logo" className="logo-image" />
        </Link>

        <div className={`navbar-center ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="nav-link" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
          </div>
        </div>

        <div className="navbar-actions">
          <form className="navbar-search" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="navbar-search"
            />
          </form>

          {user && (
            <Link to="/wishlist" className="nav-icon-btn" id="navbar-wishlist" title="Wishlist">
              <FaHeart />
            </Link>
          )}

          <Link to="/cart" className="nav-icon-btn cart-btn" id="navbar-cart" title="Cart">
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button className="nav-icon-btn user-btn profile-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} id="navbar-user">
                {user?.name ? (
                  <div className="profile-initials" title={user.name}>{getInitials(user.name)}</div>
                ) : (
                  <FaUser />
                )}
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-dropdown-name">{user.name}</span>
                    <span className="user-dropdown-email">{user.email}</span>
                  </div>
                  <div className="user-dropdown-divider" />
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FaUser /> Profile
                  </Link>
                  <Link to="/orders" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FaBox /> Orders
                  </Link>
                  <Link to="/wishlist" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FaHeart /> Wishlist
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="user-dropdown-item admin-link" onClick={() => setUserMenuOpen(false)}>
                      <FaCrown /> Admin Panel
                    </Link>
                  )}
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item logout-item" onClick={() => { logout(); setUserMenuOpen(false); }}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="navbar-login">
              Login
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
