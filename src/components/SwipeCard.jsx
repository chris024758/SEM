import React, { useState, useEffect } from 'react';
import { MapPin, Tag } from 'lucide-react';
import styles from './SwipeCard.module.css';

const SWIPE_THRESHOLD = 120; // pixels of drag needed to fire swipe

export default function SwipeCard({ listing, onSwipe, stackedIndex }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(null); // 'left' or 'right' for animation

  // Only the top card (index 0) is interactable
  const isTop = stackedIndex === 0;

  const handlePointerDown = (e) => {
    if (!isTop) return;
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !isTop) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    setCurrentX(clientX - startX);
  };

  const handlePointerUp = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);

    if (currentX > SWIPE_THRESHOLD) {
      // Swiped Right (Save)
      animateExit('right');
    } else if (currentX < -SWIPE_THRESHOLD) {
      // Swiped Left (Skip)
      animateExit('left');
    } else {
      // Snap back
      setCurrentX(0);
    }
  };

  const animateExit = (direction) => {
    setExitDirection(direction);
    // Give time for the CSS transition to play out before removing it from DOM
    setTimeout(() => {
      onSwipe(direction);
    }, 250);
  };

  // Keyboard shortcut support exposed for the parent (or just rely on parent handling it)
  // But we want to trigger the exit animation if parent says so. We'll let parent handle
  // the entire array, but if we wanted card to fly off via UI triggers, we could expose an imperative handle.
  // Instead, the parent Discover.jsx will just remove it. For smooth fly-off on button clicks,
  // we'll listen to a prop maybe? Actually, parent can just remove it instantly if they use buttons,
  // or we can implement it. Let's keep it simple: Discover.jsx controls the stack. 

  // Compute transform styles
  let transform = '';
  // The stack scaling and offset
  if (stackedIndex === 1) transform = `translateY(16px) scale(0.95)`;
  if (stackedIndex === 2) transform = `translateY(32px) scale(0.90)`;
  if (stackedIndex > 2) transform = `translateY(48px) scale(0.85)`;

  // If dragging or animating exit
  if (isTop) {
    if (exitDirection === 'right') transform = `translateX(150vw) rotate(30deg)`;
    else if (exitDirection === 'left') transform = `translateX(-150vw) rotate(-30deg)`;
    else transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
  }

  const transition = (isDragging && !exitDirection) ? 'none' : 'transform 0.25s ease-out';

  // Opacity of stamps based on drag distance
  const stampOpacity = Math.min(Math.abs(currentX) / SWIPE_THRESHOLD, 1);

  return (
    <div 
      className={styles.cardContainer}
      style={{
        transform,
        transition,
        zIndex: 10 - stackedIndex, /* 10 is top, 9 is under it, etc */
        opacity: stackedIndex > 2 ? 0 : 1 // Hide deeply nested cards
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      // Add touch equivalents just to be safe if pointer events miss on strict devices
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {isTop && !exitDirection && currentX !== 0 && (
        <>
          <div className={`${styles.stamp} ${styles.stampSkip}`} style={{ opacity: currentX < 0 ? stampOpacity : 0 }}>Skip</div>
          <div className={`${styles.stamp} ${styles.stampSave}`} style={{ opacity: currentX > 0 ? stampOpacity : 0 }}>Save</div>
        </>
      )}

      <div className={styles.imageSection}>
        <img src={listing.images[0]} alt={listing.title} className={styles.image} draggable="false" />
        <div className={styles.gradientOverlay}>
          <h2 className={styles.title}>{listing.title}</h2>
          <div className={styles.price}>₹{listing.price.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.locationContainer}>
          <MapPin size={16} />
          {listing.location}
        </div>
        <div className={styles.conditionContainer}>
          <Tag size={16} />
          {listing.condition}
        </div>
        <div>
          <span className={styles.categoryTag}>{listing.category}</span>
        </div>
      </div>
    </div>
  );
}
