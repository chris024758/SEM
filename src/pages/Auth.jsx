import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listings } from '../data/mockListings';
import Onboarding from '../components/Onboarding';
import styles from './Auth.module.css';

// Pick listings with good Unsplash images for the gallery
const galleryItems = [
  listings[0],  // Vintage Chair
  listings[1],  // Sony Walkman
  listings[2],  // Teak Coffee Table
  listings[3],  // Kodak Camera
  listings[4],  // Cotton Throw
  listings[6],  // Levi's Denim
  listings[7],  // Brass Coffee Maker
  listings[8],  // Acoustic Guitar
  listings[9],  // Antique Wall Clock
  listings[10], // Bose Speaker
  listings[11], // Cast Iron Skillet
  listings[5],  // First Edition Book
];

const col1 = galleryItems.slice(0, 6);
const col2 = galleryItems.slice(6, 12);

function GalleryCard({ item }) {
  return (
    <div className={styles.galleryCard}>
      <img src={item.images[0]} alt={item.title} className={styles.galleryImg} />
      <div className={styles.galleryCardBody}>
        <span className={styles.galleryTitle}>{item.title}</span>
        <span className={styles.galleryPrice}>₹{item.price.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (mode === 'signup' && !form.name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      let result;
      if (mode === 'signup') {
        result = signup({ name: form.name, email: form.email, password: form.password });
      } else {
        result = login({ email: form.email, password: form.password });
      }

      if (!result.success) {
        setError(result.error);
        setLoading(false);
      } else {
        const alreadyOnboarded = localStorage.getItem('ss_onboarded');
        if (mode === 'signup' && !alreadyOnboarded) {
          setLoading(false);
          setShowOnboarding(true);
        } else {
          navigate(from, { replace: true });
        }
      }
    }, 600);
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate(from, { replace: true });
  };

  return (
    <>
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <div className={styles.authPage}>
        {/* Left branding panel */}
        <div className={styles.brandPanel}>
          <div className={styles.brandOverlay} />

          <div className={styles.gallery}>
            <div className={styles.galleryCol}>
              <div className={styles.galleryTrack}>
                {[...col1, ...col1].map((item, i) => <GalleryCard key={i} item={item} />)}
              </div>
            </div>
            <div className={styles.galleryCol}>
              <div className={`${styles.galleryTrack} ${styles.galleryTrackReverse}`}>
                {[...col2, ...col2].map((item, i) => <GalleryCard key={i} item={item} />)}
              </div>
            </div>
          </div>

          <div className={styles.brandTextBlock}>
            <div className={styles.brandLogo}>SecondScroll</div>
            <h2 className={styles.brandHeadline}>Every object has a story left to tell.</h2>
            <p className={styles.brandSub}>
              India's curated marketplace for vintage finds,
              pre-loved treasures, and one-of-a-kind objects.
            </p>
            <div className={styles.brandStats}>
              <div className={styles.brandStat}>
                <span className={styles.brandStatNum}>25K+</span>
                <span className={styles.brandStatLabel}>Listings</span>
              </div>
              <div className={styles.brandStat}>
                <span className={styles.brandStatNum}>8.4K</span>
                <span className={styles.brandStatLabel}>Sellers</span>
              </div>
              <div className={styles.brandStat}>
                <span className={styles.brandStatNum}>12 Cities</span>
                <span className={styles.brandStatLabel}>Pan-India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
              <p>{mode === 'login' ? 'Sign in to your SecondScroll account.' : 'Join thousands of collectors and sellers.'}</p>
            </div>

            <div className={styles.modeTabs}>
              <button
                className={`${styles.modeTab} ${mode === 'login' ? styles.modeTabActive : ''}`}
                onClick={() => { setMode('login'); setError(''); setForm({ name: '', email: '', password: '' }); }}
              >
                Log In
              </button>
              <button
                className={`${styles.modeTab} ${mode === 'signup' ? styles.modeTabActive : ''}`}
                onClick={() => { setMode('signup'); setError(''); setForm({ name: '', email: '', password: '' }); }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {mode === 'signup' && (
                <div className={styles.field}>
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  name="password"
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
                id="auth-submit-btn"
              >
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className={styles.switchLink}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={switchMode} className={styles.switchBtn}>
                {mode === 'login' ? 'Sign up for free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
