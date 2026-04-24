import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSaved } from '../context/SavedContext';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(listing.id);
  const formattedPrice = `₹${listing.price.toLocaleString('en-IN')}`;

  return (
    <Link to={`/listing/${listing.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={listing.images[0]} alt={listing.title} className={styles.image} />
        
        <div className={styles.conditionBadge}>
          {listing.condition}
        </div>
        
        <button 
          className={`${styles.heartBtn} ${saved ? styles.saved : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggle(listing.id);
          }}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{listing.title}</h3>
        <div className={styles.price}>{formattedPrice}</div>
        
        <div className={styles.footer}>
          <span>{listing.location}</span>
          <span>{listing.postedAt}</span>
        </div>
      </div>
    </Link>
  );
}
