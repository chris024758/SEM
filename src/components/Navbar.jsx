import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Search as SearchIcon, PlusSquare, ShieldAlert, MessageCircle, LogOut, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, isLoggedIn, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePostClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/auth', { state: { from: '/post' } });
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

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
          <Link to="/post" className={styles.postBtn} onClick={handlePostClick}>
            Post a Listing
          </Link>
          <Link to="/messages" className={styles.adminIcon} title="Messages">
            <MessageCircle size={20} />
          </Link>
          <Link to="/saved" className={styles.adminIcon} title="Saved Items">
            <Heart size={20} />
          </Link>
          <Link to="/admin" className={styles.adminIcon} title="Admin Dashboard">
            <ShieldAlert size={20} />
          </Link>

          {isLoggedIn ? (
            <div className={styles.avatarWrapper} ref={dropdownRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen(o => !o)}
                title={user.name}
                id="navbar-avatar-btn"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={styles.avatar}
                />
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <img src={user.avatar} alt={user.name} className={styles.dropdownAvatar} />
                    <div>
                      <p className={styles.dropdownName}>{user.name}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link
                    to={`/profile/${encodeURIComponent(user.email)}`}
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout} id="navbar-logout-btn">
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className={styles.signInBtn} id="navbar-signin-btn">
              Sign In
            </Link>
          )}
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
        <Link to="/post" onClick={handlePostClick} className={`${styles.tabItem} ${currentPath === '/post' ? styles.activeTab : ''}`}>
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
        <Link to="/saved" className={`${styles.tabItem} ${currentPath === '/saved' ? styles.activeTab : ''}`}>
          <Heart size={24} />
          <span>Saved</span>
        </Link>
        {isLoggedIn ? (
          <button className={`${styles.tabItem}`} onClick={handleLogout}>
            <LogOut size={24} />
            <span>Log Out</span>
          </button>
        ) : (
          <Link to="/auth" className={`${styles.tabItem} ${currentPath === '/auth' ? styles.activeTab : ''}`}>
            <User size={24} />
            <span>Sign In</span>
          </Link>
        )}
      </nav>
    </>
  );
}
