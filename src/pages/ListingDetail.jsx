import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { listings } from '../data/mockListings';
import ListingCard from '../components/ListingCard';
import styles from './ListingDetail.module.css';

export default function ListingDetail() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find listing by ID
  const item = listings.find(l => l.id === id);

  // Reset image index when navigating between items
  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id]);

  if (!item) {
    return (
      <div className={`page-wrapper ${styles.notFound}`}>
        Listing not found.
        <br />
        <Link to="/" style={{ fontSize: '16px', color: 'var(--color-primary)', textDecoration: 'underline', marginTop: '16px', display: 'inline-block' }}>
          Back to feed
        </Link>
      </div>
    );
  }

  // Get 4 other items in the same category (or just random) for the "You might also like"
  const relatedItems = listings
    .filter(l => l.id !== item.id && l.category === item.category)
    .slice(0, 4);

  // If not enough related items, pad with general items
  if (relatedItems.length < 4) {
    const paddedItems = listings
      .filter(l => l.id !== item.id && !relatedItems.includes(l))
      .slice(0, 4 - relatedItems.length);
    relatedItems.push(...paddedItems);
  }

  return (
    <div className={`page-wrapper ${styles.container}`}>
      
      {/* Breadcrumbs */}
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.separator}>›</span>
        <Link to="/search" className={styles.breadcrumbLink}>{item.category}</Link>
        <span className={styles.separator}>›</span>
        <span>{item.title}</span>
      </div>

      <div className={styles.twoColumnLayout}>
        
        {/* LEFT COLUMN: Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageFrame}>
            <img 
              src={item.images[activeImageIndex]} 
              alt={item.title} 
              className={styles.mainImage} 
            />
          </div>

          {/* Thumbnails (only show if more than 1 image) */}
          {item.images.length > 1 && (
            <div className={styles.thumbnailRow}>
              {item.images.map((imgSrc, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`${styles.thumbnailBtn} ${activeImageIndex === index ? styles.activeThumbnail : ''}`}
                >
                  <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className={styles.thumbnail} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Info Panel */}
        <div>
          <div className={styles.infoPanel}>
            <div className={styles.conditionBadge}>
              {item.condition}
            </div>
            
            <h1 className={styles.title}>{item.title}</h1>
            <div className={styles.price}>₹{item.price.toLocaleString('en-IN')}</div>

            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <MapPin size={18} />
                {item.location}
              </div>
              <div className={styles.metaItem}>
                <Clock size={18} />
                Posted {item.postedAt}
              </div>
            </div>

            <hr className={styles.divider} />

            <Link to={`/profile/${encodeURIComponent(item.seller.name)}`} className={styles.sellerBlock} style={{ textDecoration: 'none' }}>
              <img src={item.seller.avatar} alt={item.seller.name} className={styles.sellerAvatar} />
              <div className={styles.sellerInfo}>
                <span className={styles.sellerName}>{item.seller.name}</span>
                <span className={styles.sellerRating}>
                  <Star size={14} className={styles.starIcon} />
                  {item.seller.rating} / 5.0
                </span>
              </div>
            </Link>

            <div className={styles.actions}>
              <Link 
                to={`/messages/${encodeURIComponent(item.seller.name)}`}
                className={styles.primaryBtn}
                style={{ textAlign: 'center' }}
              >
                Message Seller
              </Link>
              <button 
                className={styles.ghostBtn}
                onClick={() => alert('Demo: Saved to wishlist!')}
              >
                <Heart size={18} fill={item.saved ? "currentColor" : "none"} />
                {item.saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: About & Related */}
      <div className={styles.lowerSection}>
        <h2 className={styles.sectionHeading}>About this item</h2>
        <p className={styles.description}>{item.description}</p>
      </div>

      <h2 className={styles.sectionHeading}>You might also like</h2>
      <div className={styles.relatedGrid}>
        {relatedItems.map((related) => (
          <ListingCard key={related.id} listing={related} />
        ))}
      </div>

    </div>
  );
}
