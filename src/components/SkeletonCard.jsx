import React from 'react';
import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      {/* 16:9 Image Block */}
      <div className={`${styles.imagePlaceholder} ${styles.shimmer}`}></div>
      
      <div className={styles.body}>
        {/* Title Blocks: Two lines mock */}
        <div className={`${styles.titlePlaceholder} ${styles.shimmer}`}></div>
        <div className={`${styles.titlePlaceholderShort} ${styles.shimmer}`}></div>
        
        {/* Price Block */}
        <div className={`${styles.pricePlaceholder} ${styles.shimmer}`}></div>
        
        {/* Footer block (location and time space) */}
        <div className={styles.footer}>
          <div className={`${styles.footerPlaceholder} ${styles.shimmer}`}></div>
          <div className={`${styles.footerPlaceholder} ${styles.shimmer}`}></div>
        </div>
      </div>
    </div>
  );
}
