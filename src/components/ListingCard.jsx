import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
  // Format price roughly
  const formattedPrice = `₹${listing.price.toLocaleString('en-IN')}`;

  return (
    <Link to={`/listing/${listing.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={listing.images[0]} alt={listing.title} className={styles.image} />
        
        <div className={styles.conditionBadge}>
          {listing.condition}
        </div>
        
        <button 
          className={`${styles.heartBtn} ${listing.saved ? styles.saved : ''}`}
          onClick={(e) => {
            e.preventDefault(); // Prevent navigating to /listing/:id
            // In a real app we'd toggle the save state here
            console.log('Toggle save for', listing.id);
          }}
          aria-label="Save listing"
        >
          <Heart size={16} fill={listing.saved ? "currentColor" : "none"} />
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
