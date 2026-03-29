import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Heart } from 'lucide-react';
import { listings as mockListings } from '../data/mockListings';
import SwipeCard from '../components/SwipeCard';
import styles from './Discover.module.css';

export default function Discover() {
  const navigate = useNavigate();
  // We keep a local track of cards left to swipe
  const [deck, setDeck] = useState(mockListings);

  // Handle programmatic or physical swipe
  const handleSwipe = (direction) => {
    // If direction is provided, we animate it. 
    // In this basic version, physical drag handles its own animation and calls us just to "pop" it.
    // So we just slice the array.
    setDeck(prev => prev.slice(1));
  };

  // Keyboard support: Left arrow = skip, Right arrow = save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (deck.length === 0) return;
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck]);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      
      {/* Header Area */}
      <div className={styles.headerRow}>
        <button onClick={() => navigate('/')} className={styles.backBtn} aria-label="Go back to feed">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.counter}>
          {deck.length} items near you
        </div>
        <div className={styles.invisiblePlaceholder} />
      </div>

      {/* Card Stack */}
      <div className={styles.stackContainer}>
        {deck.length > 0 ? (
          // We slice 3 cards so we only render the top few to DOM for performance/layering
          deck.slice(0, 3).map((listing, i) => (
            <SwipeCard 
              key={listing.id} 
              listing={listing} 
              stackedIndex={i} 
              onSwipe={handleSwipe} 
            />
          )).reverse() // Reverse so index 0 is at the end of the array, meaning highest z-index / rendered last
        ) : (
          <div className={styles.emptyState}>
            <h2>You're all caught up!</h2>
            <p>Check back later for new finds in your area.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionsContainer}>
        <button 
          className={`${styles.actionBtn} ${styles.skip}`} 
          onClick={() => handleSwipe('left')}
          disabled={deck.length === 0}
          aria-label="Skip listing"
        >
          <X size={32} />
        </button>
        <button 
          className={`${styles.actionBtn} ${styles.save}`} 
          onClick={() => handleSwipe('right')}
          disabled={deck.length === 0}
          aria-label="Save listing"
        >
          <Heart size={32} fill="currentColor" />
        </button>
      </div>

    </div>
  );
}
