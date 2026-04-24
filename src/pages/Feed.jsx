import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Grid, Layers, Search, ArrowRight } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { listings } from '../data/mockListings';
import styles from './Feed.module.css';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Books', 'Clothing', 'Kitchen', 'Home', 'Hobbies'];

// Curated sections from mock data
const featuredListings = [listings[2], listings[10], listings[15]]; // Teak table, Bose, Turntable
const newArrivals = [listings[3], listings[6], listings[11], listings[18], listings[23]]; // recent "postedAt" items

export default function Feed() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredListings = listings.filter(listing => {
    if (activeCategory === 'All') return true;
    return listing.category === activeCategory || listing.category.includes(activeCategory);
  });

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const showSections = activeCategory === 'All' && !isLoading;

  return (
    <div className={`page-wrapper ${styles.container}`}>
      
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Find something wonderful</h1>
        <div className={styles.modeToggle}>
          <button className={`${styles.toggleBtn} ${styles.active}`} aria-label="Grid view">
            <Grid size={20} />
          </button>
          <button 
            className={styles.toggleBtn} 
            onClick={() => navigate('/discover')}
            aria-label="Discover swipe view"
          >
            <Layers size={20} />
          </button>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder="Search for anything… press Enter"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <div className={styles.pillScroll}>
        {CATEGORIES.map(category => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${styles.pill} ${activeCategory === category ? styles.active : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array(12).fill(0).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
        </div>
      ) : showSections ? (
        <>
          {/* ── Featured Section ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>✦ Featured Picks</h2>
                <p className={styles.sectionSub}>Handpicked by our team this week</p>
              </div>
              <Link to="/search" className={styles.seeAll}>Browse all <ArrowRight size={14} /></Link>
            </div>
            <div className={styles.featuredGrid}>
              {featuredListings.map(listing => (
                <div key={listing.id} className={styles.featuredCard}>
                  <ListingCard listing={listing} />
                  <div className={styles.featuredBadge}>Featured</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── New Arrivals ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>🆕 New Arrivals</h2>
                <p className={styles.sectionSub}>Just listed in the last 24 hours</p>
              </div>
              <Link to="/search?sort=newest" className={styles.seeAll}>See all <ArrowRight size={14} /></Link>
            </div>
            <div className={styles.horizontalScroll}>
              {newArrivals.map(listing => (
                <div key={listing.id} className={styles.scrollCard}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </section>

          {/* ── Browse All ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Browse All</h2>
            </div>
            <div className={styles.grid}>
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        </>
      ) : filteredListings.length > 0 ? (
        <div className={styles.grid}>
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No items found in {activeCategory}. We're still growing our catalog!
        </div>
      )}

    </div>
  );
}
