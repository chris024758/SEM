import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageCircle, MapPin } from 'lucide-react';
import { listings } from '../data/mockListings';
import ListingCard from '../components/ListingCard';
import styles from './SellerProfile.module.css';

export default function SellerProfile() {
  const { id } = useParams(); // Using the seller's exact name string as ID

  // Filter all items by this seller
  const sellerListings = listings.filter(l => l.seller.name === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (sellerListings.length === 0) {
    return (
      <div className={`page-wrapper ${styles.notFound}`}>
        <h2>Seller not found</h2>
        <p>This seller does not exist or has no active listings.</p>
        <Link to="/" className={styles.backLink}>Return to Feed</Link>
      </div>
    );
  }

  // Extract seller bio details from the first listing matched
  const sellerData = sellerListings[0].seller;

  return (
    <div className={`page-wrapper ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <img src={sellerData.avatar} alt={sellerData.name} className={styles.avatar} />
          <div className={styles.details}>
            <h1 className={styles.name}>{sellerData.name}</h1>
            <div className={styles.meta}>
              <span className={styles.rating}>
                <Star size={16} className={styles.starIcon} />
                {sellerData.rating} Rating
              </span>
              <span className={styles.separator}>•</span>
              <span className={styles.location}>
                <MapPin size={16} /> Member since 2023
              </span>
            </div>
          </div>
        </div>

        <Link to={`/messages/${encodeURIComponent(sellerData.name)}`} className={styles.messageBtn}>
          <MessageCircle size={20} />
          Message Seller
        </Link>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <h3>{sellerListings.length}</h3>
          <p>Active Listings</p>
        </div>
        <div className={styles.statBox}>
          <h3>142</h3>
          <p>Items Sold</p>
        </div>
        <div className={styles.statBox}>
          <h3>12 hrs</h3>
          <p>Avg. Response</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Shop {sellerData.name}'s Collection</h2>
      
      <div className={styles.grid}>
        {sellerListings.map(item => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </div>
  );
}
