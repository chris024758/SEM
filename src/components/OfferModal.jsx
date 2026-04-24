import React, { useState } from 'react';
import { X, Tag, MessageSquare, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './OfferModal.module.css';

export default function OfferModal({ listing, onClose }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [offerPrice, setOfferPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
          <div className={styles.authPrompt}>
            <Tag size={36} className={styles.authIcon} />
            <h2>Sign in to make an offer</h2>
            <p>You need an account to send offers to sellers.</p>
            <button className={styles.submitBtn} onClick={() => { onClose(); navigate('/auth'); }}>
              Sign In / Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.successState}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h2>Offer Sent!</h2>
            <p>Your offer of <strong>₹{parseInt(offerPrice).toLocaleString('en-IN')}</strong> has been sent to <strong>{listing.seller.name}</strong>. They'll respond via messages.</p>
            <button className={styles.submitBtn} onClick={() => { onClose(); navigate(`/messages/${encodeURIComponent(listing.seller.name)}`); }}>
              Go to Messages
            </button>
            <button className={styles.ghostBtn} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseInt(offerPrice, 10);
    if (!offerPrice || isNaN(price) || price <= 0) {
      setError('Please enter a valid offer amount.');
      return;
    }
    if (price > listing.price) {
      setError(`Your offer can't exceed the asking price of ₹${listing.price.toLocaleString('en-IN')}.`);
      return;
    }

    // Store offer in localStorage for demo persistence
    const offers = JSON.parse(localStorage.getItem('ss_offers') || '[]');
    offers.push({
      listingId: listing.id,
      listingTitle: listing.title,
      sellerName: listing.seller.name,
      offerPrice: price,
      message,
      sentAt: new Date().toISOString(),
    });
    localStorage.setItem('ss_offers', JSON.stringify(offers));
    setSubmitted(true);
  };

  const pct = offerPrice ? Math.round((parseInt(offerPrice) / listing.price) * 100) : null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Make an Offer</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.listingSnippet}>
          <img src={listing.images[0]} alt={listing.title} className={styles.snippetImg} />
          <div>
            <p className={styles.snippetTitle}>{listing.title}</p>
            <p className={styles.snippetAsking}>Asking: <strong>₹{listing.price.toLocaleString('en-IN')}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="offer-price">Your Offer (₹)</label>
            <div className={styles.priceInput}>
              <span className={styles.rupeeSign}>₹</span>
              <input
                id="offer-price"
                type="number"
                min="1"
                max={listing.price}
                placeholder={Math.round(listing.price * 0.8).toString()}
                value={offerPrice}
                onChange={e => { setOfferPrice(e.target.value); setError(''); }}
              />
            </div>
            {pct !== null && (
              <p className={`${styles.pctHint} ${pct < 70 ? styles.pctLow : pct < 90 ? styles.pctMid : styles.pctHigh}`}>
                {pct}% of asking price — {pct >= 90 ? 'Great offer!' : pct >= 75 ? 'Fair offer' : 'Low offer — seller may decline'}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="offer-message">
              <MessageSquare size={14} /> Message (optional)
            </label>
            <textarea
              id="offer-message"
              rows={3}
              placeholder="Hi! I'm interested in this item..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className={styles.textarea}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} id="offer-submit-btn">
            Send Offer
          </button>
          <button type="button" className={styles.ghostBtn} onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
