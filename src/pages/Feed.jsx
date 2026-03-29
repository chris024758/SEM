import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Layers, Search } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { listings } from '../data/mockListings';
import styles from './Feed.module.css';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Books', 'Clothing', 'Sports', 'Kitchen', 'Home'];

export default function Feed() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network delay to show off skeletons
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Client-side filtering by category
  const filteredListings = listings.filter(listing => {
    if (activeCategory === 'All') return true;
    return listing.category === activeCategory;
  });

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          placeholder="Search for anything (e.g. 'chair', 'vintage')... Press Enter to search."
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
