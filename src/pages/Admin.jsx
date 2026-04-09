import React, { useState } from 'react';
import { Users, Activity, Image as ImageIcon, Trash2, Star } from 'lucide-react';
import styles from './Admin.module.css';

// Mock listings data
const initialListings = [
  { id: 1, title: 'Vintage Leather Jacket', price: '$120', status: 'Active', date: 'Oct 12' },
  { id: 2, title: 'Sony Walkman Player', price: '$85', status: 'Active', date: 'Oct 11' },
  { id: 3, title: 'Mid-century Coffee Table', price: '$300', status: 'Pending', date: 'Oct 09' },
  { id: 4, title: 'Retro Typewriter', price: '$150', status: 'Active', date: 'Oct 08' },
];

export default function Admin() {
  const [listings, setListings] = useState(initialListings);

  const handleDelete = (id) => {
    setListings(listings.filter(listing => listing.id !== id));
  };

  const handleFeature = (id) => {
    // In a real app, this would toggle a 'featured' flag in the database
    alert(`Featured listing #${id}`);
  };

  return (
    <div className={`page-wrapper ${styles.adminContainer}`}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Overview of platform activity and content management.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ImageIcon size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Total Listings</h3>
            <p>1,248</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Active Users</h3>
            <p>842</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Activity size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Weekly Traffic</h3>
            <p>12.5K</p>
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h2>Recent Listings</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td className={styles.itemTitle}>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => handleFeature(item.id)} className={styles.iconBtn} title="Feature">
                      <Star size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>No listings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
