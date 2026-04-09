import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search as SearchIcon, PlusSquare, ShieldAlert, MessageCircle } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Desktop Navbar */}
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
          <Link to="/messages" className={styles.adminIcon} title="Messages">
            <MessageCircle size={20} />
          </Link>
          <Link to="/admin" className={styles.adminIcon} title="Admin Dashboard">
            <ShieldAlert size={20} />
          </Link>
          <img 
            src="https://i.pravatar.cc/150?u=user" 
            alt="User Profile" 
            className={styles.avatar}
          />
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className={styles.mobileTabBar}>
        <Link to="/" className={`${styles.tabItem} ${currentPath === '/' ? styles.activeTab : ''}`}>
          <Home size={24} />
          <span>Feed</span>
        </Link>
        <Link to="/discover" className={`${styles.tabItem} ${currentPath === '/discover' ? styles.activeTab : ''}`}>
          <Compass size={24} />
          <span>Discover</span>
        </Link>
        <Link to="/post" className={`${styles.tabItem} ${currentPath === '/post' ? styles.activeTab : ''}`}>
          <PlusSquare size={24} />
          <span>Post</span>
        </Link>
        <Link to="/search" className={`${styles.tabItem} ${currentPath === '/search' ? styles.activeTab : ''}`}>
          <SearchIcon size={24} />
          <span>Search</span>
        </Link>
        <Link to="/messages" className={`${styles.tabItem} ${currentPath.startsWith('/messages') ? styles.activeTab : ''}`}>
          <MessageCircle size={24} />
          <span>Inbox</span>
        </Link>
        <Link to="/admin" className={`${styles.tabItem} ${currentPath === '/admin' ? styles.activeTab : ''}`}>
          <ShieldAlert size={24} />
          <span>Admin</span>
        </Link>
      </nav>
    </>
  );
}
