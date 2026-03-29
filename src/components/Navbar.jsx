import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        SecondScroll
      </Link>
      
      <div className={styles.navLinks}>
        <Link to="/" className={`${styles.link} ${currentPath === '/' ? styles.active : ''}`}>
          Feed
        </Link>
        <Link to="/discover" className={`${styles.link} ${currentPath === '/discover' ? styles.active : ''}`}>
          Discover
        </Link>
        <Link to="/search" className={`${styles.link} ${currentPath === '/search' ? styles.active : ''}`}>
          Search
        </Link>
      </div>

      <div className={styles.rightSide}>
        <Link to="/post" className={styles.postBtn}>
          Post a Listing
        </Link>
        <img 
          src="https://i.pravatar.cc/150?u=user" 
          alt="User Profile" 
          className={styles.avatar}
        />
      </div>
    </nav>
  );
}
