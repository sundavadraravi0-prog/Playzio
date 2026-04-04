import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';
import './About.css';

const About = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" id="about-page">
      {/* About Hero */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">About Playzio</h1>
          <p className="about-hero-text">We believe every child deserves toys that inspire creativity, spark imagination, and bring joy.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-story">
              <h2 className="section-title">Our Story</h2>
              <p>Founded in 2024, Playzio started with a simple mission: to make quality toys accessible to every family. We carefully curate our collection to ensure every product is safe, educational, and, most importantly, fun!</p>
              <p>From building blocks that develop spatial skills to science kits that spark curiosity, we believe play is the most powerful form of learning.</p>
            </div>
            <div className="about-stats">
              <div className="about-stat-card">
                <span className="about-stat-value">10K+</span>
                <span className="about-stat-label">Happy Families</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-value">500+</span>
                <span className="about-stat-label">Unique Toys</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-value">50+</span>
                <span className="about-stat-label">Trusted Brands</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-value">4.9</span>
                <span className="about-stat-label">Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose Us</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>What makes Playzio special</p>
          <div className="values-grid">
            <div className="value-card"><span className="value-emoji">🛡️</span><h3>Safe & Tested</h3><p>All toys meet the highest safety standards and are tested for quality.</p></div>
            <div className="value-card"><span className="value-emoji">🎓</span><h3>Educational</h3><p>We prioritize toys that help children learn while they play.</p></div>
            <div className="value-card"><span className="value-emoji">♻️</span><h3>Eco-Friendly</h3><p>Sustainable materials and packaging for a better planet.</p></div>
            <div className="value-card"><span className="value-emoji">💰</span><h3>Great Prices</h3><p>Quality toys at prices that won't break the bank.</p></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section" id="contact-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Get in Touch</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>We'd love to hear from you!</p>

          <div className="contact-layout">
            <div className="contact-info">
              <div className="contact-item"><FaMapMarkerAlt className="contact-icon" /><div><strong>Address</strong><p>123 Toy Lane, Fun City, FC 12345</p></div></div>
              <div className="contact-item"><FaPhone className="contact-icon" /><div><strong>Phone</strong><p>+1 (555) 123-4567</p></div></div>
              <div className="contact-item"><FaEnvelope className="contact-icon" /><div><strong>Email</strong><p>hello@playzio.com</p></div></div>
              <div className="contact-item"><FaClock className="contact-icon" /><div><strong>Hours</strong><p>Mon-Sat: 9AM - 8PM</p></div></div>
            </div>

            <form className="contact-form card" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="contact-name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required id="contact-email" /></div>
              </div>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} id="contact-subject" /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows="5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required id="contact-message" /></div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="contact-submit"><FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
