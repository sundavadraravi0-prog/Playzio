import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const categories = [
  { name: 'Action Figures', emoji: '🦸', color: '#7c3aed' },
  { name: 'Building Blocks', emoji: '🧱', color: '#f97316' },
  { name: 'Educational', emoji: '📚', color: '#14b8a6' },
  { name: 'Board Games', emoji: '🎲', color: '#ec4899' },
  { name: 'Dolls', emoji: '👸', color: '#a855f7' },
  { name: 'Vehicles', emoji: '🚗', color: '#3b82f6' },
  { name: 'Outdoor', emoji: '⚽', color: '#22c55e' },
  { name: 'Arts & Crafts', emoji: '🎨', color: '#eab308' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getFeatured();
        setFeatured(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page" id="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">New Arrivals Are Here</span>
            <h1 className="hero-title">
              Find the Perfect <span className="gradient-text">Toy</span> for Every Kid
            </h1>
            <p className="hero-subtitle">
              Browse our collection of toys, games, and educational products — carefully picked for kids of all ages.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg" id="hero-shop-btn">
                Shop Now <FaArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg" id="hero-about-btn">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-emoji-grid">
              <span className="hero-emoji e1">🧸</span>
              <span className="hero-emoji e2">🎮</span>
              <span className="hero-emoji e3">🚀</span>
              <span className="hero-emoji e4">🎨</span>
              <span className="hero-emoji e5">🧩</span>
              <span className="hero-emoji e6">🤖</span>
              <span className="hero-emoji e7">🎪</span>
              <span className="hero-emoji e8">🌈</span>
              <span className="hero-emoji e9">⭐</span>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none"><path d="M0 120V60C240 20 480 0 720 20C960 40 1200 80 1440 60V120H0Z" fill="var(--gray-50)"/></svg>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Shop by Category</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Find the right toy for every interest</p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                key={cat.name}
                style={{ '--cat-color': cat.color }}
                id={`cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Featured Toys</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Our most popular picks</p>
            </div>
            <Link to="/shop" className="btn btn-secondary">
              View All <FaArrowRight />
            </Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid-products">
              {featured.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon"><FaTruck /></div>
              <h4>Free Shipping</h4>
              <p>On orders over ₹4000</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><FaShieldAlt /></div>
              <h4>Safe & Secure</h4>
              <p>100% secure checkout</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><FaUndo /></div>
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon"><FaHeadset /></div>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2 className="cta-title">Ready to Start Shopping?</h2>
          <p className="cta-text">Create an account to save your favorites, track orders, and get exclusive deals.</p>
          <Link to="/register" className="btn btn-accent btn-lg" id="cta-register-btn">
            Create Account <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
