import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Heart, Tag } from 'lucide-react';
import { listings } from '../data/mockListings';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import OfferModal from '../components/OfferModal';
import styles from './ListingDetail.module.css';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showOffer, setShowOffer] = useState(false);

  const { isSaved, toggle } = useSaved();
  const { isLoggedIn } = useAuth();

  const item = listings.find(l => l.id === id);
  const saved = item ? isSaved(item.id) : false;

  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
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

  const relatedItems = listings
    .filter(l => l.id !== item.id && l.category === item.category)
    .slice(0, 4);

  if (relatedItems.length < 4) {
    const paddedItems = listings
      .filter(l => l.id !== item.id && !relatedItems.includes(l))
      .slice(0, 4 - relatedItems.length);
    relatedItems.push(...paddedItems);
  }

  const handleMessageSeller = () => {
    if (!isLoggedIn) {
      navigate('/auth', { state: { from: `/messages/${encodeURIComponent(item.seller.name)}` } });
    } else {
      navigate(`/messages/${encodeURIComponent(item.seller.name)}`);
    }
  };

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
              <button
                className={styles.primaryBtn}
                onClick={handleMessageSeller}
              >
                Message Seller
              </button>
              <button 
                className={styles.offerBtn}
                onClick={() => setShowOffer(true)}
              >
                <Tag size={16} />
                Make an Offer
              </button>
              <button 
                className={`${styles.ghostBtn} ${saved ? styles.ghostBtnSaved : ''}`}
                onClick={() => toggle(item.id)}
              >
                <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
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

      <div className={styles.relatedHeader}>
        <h2 className={styles.sectionHeading}>More in {item.category}</h2>
        <Link to={`/search?category=${encodeURIComponent(item.category)}`} className={styles.seeAllLink}>
          See all →
        </Link>
      </div>
      <div className={styles.relatedGrid}>
        {relatedItems.map((related) => (
          <ListingCard key={related.id} listing={related} />
        ))}
      </div>

      {/* Offer Modal */}
      {showOffer && <OfferModal listing={item} onClose={() => setShowOffer(false)} />}
    </div>
  );
}
