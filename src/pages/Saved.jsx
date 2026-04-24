import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { listings } from '../data/mockListings';
import ListingCard from '../components/ListingCard';
import styles from './Saved.module.css';

export default function Saved() {
  const { savedIds, toggle } = useSaved();

  const savedListings = listings.filter(l => savedIds.includes(l.id));

  return (
    <div className={`page-wrapper ${styles.container}`}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={18} /> Back to Feed
        </Link>
        <div className={styles.titleRow}>
          <h1>
            <Heart size={26} className={styles.heartIcon} />
            Saved Items
          </h1>
          <span className={styles.count}>{savedListings.length} item{savedListings.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {savedListings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤍</div>
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on any listing to save it here for later.</p>
          <Link to="/" className={styles.browseBtn}>Browse Listings</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {savedListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
