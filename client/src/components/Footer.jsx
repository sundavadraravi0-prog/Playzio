import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/playzio-logo.png" alt="Playzio Logo" className="footer-logo-image" />
            </Link>
            <p className="footer-desc">
              The ultimate toy store for kids! We bring joy and imagination to children of all ages with our curated collection of toys, games, and educational tools.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-link" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Shop</h4>
            <Link to="/shop?category=Action Figures" className="footer-link">Action Figures</Link>
            <Link to="/shop?category=Building Blocks" className="footer-link">Building Blocks</Link>
            <Link to="/shop?category=Educational" className="footer-link">Educational</Link>
            <Link to="/shop?category=Board Games" className="footer-link">Board Games</Link>
            <Link to="/shop?category=Outdoor" className="footer-link">Outdoor Toys</Link>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Account</h4>
            <Link to="/profile" className="footer-link">My Profile</Link>
            <Link to="/orders" className="footer-link">My Orders</Link>
            <Link to="/wishlist" className="footer-link">Wishlist</Link>
            <Link to="/cart" className="footer-link">Shopping Cart</Link>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Help</h4>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/about" className="footer-link">Contact</Link>
            <a href="#" className="footer-link">Shipping Info</a>
            <a href="#" className="footer-link">Returns Policy</a>
            <a href="#" className="footer-link">FAQ</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Playzio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
