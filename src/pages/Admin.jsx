import React, { useState } from 'react';
import {
  Users, ShoppingBag, TrendingUp, Star, Activity,
  Trash2, IndianRupee, BarChart2, Clock, CheckCircle,
  AlertTriangle, RotateCcw, UserPlus, ChevronUp, ChevronDown
} from 'lucide-react';
import { listings as allListings } from '../data/mockListings';
import styles from './Admin.module.css';

// ── Mock Analytics Data ───────────────────────────────────────────────────────

const monthlyData = [
  { month: 'Nov', gmv: 3.2, users: 5.1 },
  { month: 'Dec', gmv: 4.8, users: 6.4 },
  { month: 'Jan', gmv: 4.1, users: 7.0 },
  { month: 'Feb', gmv: 5.9, users: 8.3 },
  { month: 'Mar', gmv: 7.2, users: 9.1 },
  { month: 'Apr', gmv: 8.4, users: 10.5 },
];

const categoryData = [
  { name: 'Electronics', count: 7, color: '#C17F3E' },
  { name: 'Furniture', count: 4, color: '#6B8F71' },
  { name: 'Home', count: 6, color: '#8B7355' },
  { name: 'Hobbies', count: 4, color: '#9B7FA6' },
  { name: 'Clothing', count: 2, color: '#C17F3E' },
  { name: 'Kitchen', count: 2, color: '#5F9EA0' },
];
const maxCategoryCount = Math.max(...categoryData.map(c => c.count));

const recentSignups = [
  { name: 'Priya Sharma', email: 'priya@example.com', joined: '2 hours ago', listings: 3, avatar: 'https://i.pravatar.cc/150?u=priya' },
  { name: 'Rahul Desai', email: 'rahul@example.com', joined: 'Yesterday', listings: 7, avatar: 'https://i.pravatar.cc/150?u=rahul' },
  { name: 'Ananya Mehta', email: 'ananya@example.com', joined: '2 days ago', listings: 1, avatar: 'https://i.pravatar.cc/150?u=ananya' },
  { name: 'Vikram Rao', email: 'vikram@example.com', joined: '3 days ago', listings: 5, avatar: 'https://i.pravatar.cc/150?u=vikram' },
  { name: 'Neha Singh', email: 'neha@example.com', joined: '5 days ago', listings: 2, avatar: 'https://i.pravatar.cc/150?u=neha' },
];

const enhancedListings = allListings.slice(0, 8).map((l, i) => ({
  ...l,
  views: Math.floor(Math.random() * 800 + 100),
  saves: Math.floor(Math.random() * 80 + 5),
  status: i % 5 === 0 ? 'Pending' : 'Active',
  featured: i === 1 || i === 3,
}));

// ── SVG Line Chart ───────────────────────────────────────────────────────────

function LineChart({ data }) {
  const W = 600, H = 200, PAD = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxGMV = Math.max(...data.map(d => d.gmv));
  const maxUsers = Math.max(...data.map(d => d.users));

  const xStep = innerW / (data.length - 1);

  const gmvPoints = data.map((d, i) => ({
    x: PAD.left + i * xStep,
    y: PAD.top + innerH - (d.gmv / maxGMV) * innerH,
    val: d.gmv,
  }));
  const userPoints = data.map((d, i) => ({
    x: PAD.left + i * xStep,
    y: PAD.top + innerH - (d.users / maxUsers) * innerH,
    val: d.users,
  }));

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Smooth area fill
  const toArea = (pts, base) =>
    `M ${pts[0].x} ${pts[0].y} ` +
    pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z`;

  const base = PAD.top + innerH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg} preserveAspectRatio="none">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(t => (
        <line
          key={t}
          x1={PAD.left} y1={PAD.top + innerH * (1 - t)}
          x2={W - PAD.right} y2={PAD.top + innerH * (1 - t)}
          stroke="rgba(44,36,22,0.07)" strokeWidth="1"
        />
      ))}

      {/* Area fills */}
      <path d={toArea(gmvPoints, base)} fill="rgba(193,127,62,0.12)" />
      <path d={toArea(userPoints, base)} fill="rgba(107,143,113,0.10)" />

      {/* Lines */}
      <path d={toPath(gmvPoints)} fill="none" stroke="#C17F3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={toPath(userPoints)} fill="none" stroke="#6B8F71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {gmvPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#C17F3E" stroke="#fff" strokeWidth="2" />
      ))}
      {userPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6B8F71" stroke="#fff" strokeWidth="2" />
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={PAD.left + i * xStep}
          y={H - 4}
          textAnchor="middle"
          fontSize="11"
          fill="#7A6A52"
          fontFamily="DM Sans, sans-serif"
        >{d.month}</text>
      ))}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Admin() {
  const [tableListings, setTableListings] = useState(enhancedListings);
  const [sortKey, setSortKey] = useState('views');
  const [sortDir, setSortDir] = useState('desc');
  const [activeTab, setActiveTab] = useState('overview');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...tableListings].sort((a, b) => {
    let av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id) => setTableListings(l => l.filter(x => x.id !== id));
  const handleFeature = (id) => setTableListings(l => l.map(x => x.id === id ? { ...x, featured: !x.featured } : x));

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronUp size={13} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const totalGMV = allListings.reduce((s, l) => s + l.price, 0);
  const avgPrice = Math.round(totalGMV / allListings.length);

  return (
    <div className={`page-wrapper ${styles.adminContainer}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Platform analytics, content and user management.</p>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.liveTag}>● Live</span>
          <span className={styles.lastUpdated}>Updated just now</span>
        </div>
      </div>

      {/* Tab Nav */}
      <div className={styles.tabNav}>
        {['overview', 'listings', 'users'].map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab)}
            id={`admin-tab-${tab}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(193,127,62,0.12)', color: '#C17F3E' }}>
                <ShoppingBag size={20} />
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>Total Listings</span>
                <span className={styles.kpiValue}>1,248</span>
                <span className={`${styles.kpiTrend} ${styles.trendUp}`}><ChevronUp size={13} />+12% this month</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(107,143,113,0.12)', color: '#6B8F71' }}>
                <Users size={20} />
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>Active Users</span>
                <span className={styles.kpiValue}>10,512</span>
                <span className={`${styles.kpiTrend} ${styles.trendUp}`}><ChevronUp size={13} />+18% this month</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(193,127,62,0.12)', color: '#8B5A2B' }}>
                <IndianRupee size={20} />
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>Gross Merch. Value</span>
                <span className={styles.kpiValue}>₹{(totalGMV / 100000).toFixed(1)}L</span>
                <span className={`${styles.kpiTrend} ${styles.trendUp}`}><ChevronUp size={13} />+24% vs last month</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(155,127,166,0.12)', color: '#9B7FA6' }}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>Avg. Listing Price</span>
                <span className={styles.kpiValue}>₹{avgPrice.toLocaleString()}</span>
                <span className={`${styles.kpiTrend} ${styles.trendDown}`}><ChevronDown size={13} />-3% vs last month</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(95,158,160,0.12)', color: '#5F9EA0' }}>
                <Activity size={20} />
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>Sold This Week</span>
                <span className={styles.kpiValue}>143</span>
                <span className={`${styles.kpiTrend} ${styles.trendUp}`}><ChevronUp size={13} />+9% vs last week</span>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(193,127,62,0.12)', color: '#C17F3E' }}>
                <Star size={20} />
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>Seller Satisfaction</span>
                <span className={styles.kpiValue}>4.73 / 5</span>
                <span className={`${styles.kpiTrend} ${styles.trendUp}`}><ChevronUp size={13} />+0.12 pts</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={styles.chartsRow}>
            {/* Line Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h2>GMV & User Growth</h2>
                  <p>Monthly trends — last 6 months</p>
                </div>
                <div className={styles.chartLegend}>
                  <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#C17F3E' }} />GMV (₹L)</span>
                  <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#6B8F71' }} />Users (K)</span>
                </div>
              </div>
              <LineChart data={monthlyData} />
            </div>

            {/* Category breakdown */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h2>Category Breakdown</h2>
                  <p>Listings by category</p>
                </div>
              </div>
              <div className={styles.barChart}>
                {categoryData.map(c => (
                  <div key={c.name} className={styles.barRow}>
                    <span className={styles.barLabel}>{c.name}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${(c.count / maxCategoryCount) * 100}%`,
                          background: c.color,
                        }}
                      />
                    </div>
                    <span className={styles.barCount}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className={styles.healthSection}>
            <h2>Platform Health</h2>
            <div className={styles.healthGrid}>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon}><Clock size={18} /></div>
                <div className={styles.healthBody}>
                  <span className={styles.healthLabel}>Avg. Days to Sell</span>
                  <span className={styles.healthValue}>6.2 days</span>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ color: '#6B8F71' }}><CheckCircle size={18} /></div>
                <div className={styles.healthBody}>
                  <span className={styles.healthLabel}>Listing Completion</span>
                  <span className={styles.healthValue}>87.4%</span>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ color: '#C17F3E' }}><AlertTriangle size={18} /></div>
                <div className={styles.healthBody}>
                  <span className={styles.healthLabel}>Dispute Rate</span>
                  <span className={styles.healthValue}>1.2%</span>
                </div>
              </div>
              <div className={styles.healthCard}>
                <div className={styles.healthIcon} style={{ color: '#9B7FA6' }}><RotateCcw size={18} /></div>
                <div className={styles.healthBody}>
                  <span className={styles.healthLabel}>Return Rate</span>
                  <span className={styles.healthValue}>2.8%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── LISTINGS TAB ── */}
      {activeTab === 'listings' && (
        <div className={styles.tableSection}>
          <div className={styles.tableSectionHeader}>
            <h2>All Listings</h2>
            <span className={styles.tableCount}>{tableListings.length} items</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th className={styles.sortable} onClick={() => handleSort('price')}>
                    Price <SortIcon k="price" />
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort('views')}>
                    Views <SortIcon k="views" />
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort('saves')}>
                    Saves <SortIcon k="saves" />
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.itemCell}>
                        <img src={item.images[0]} alt={item.title} className={styles.itemThumb} />
                        <span className={styles.itemTitle}>{item.title}</span>
                        {item.featured && <span className={styles.featuredBadge}>★ Featured</span>}
                      </div>
                    </td>
                    <td className={styles.categoryCell}>{item.category}</td>
                    <td style={{ fontWeight: 600 }}>₹{item.price.toLocaleString()}</td>
                    <td>{item.views.toLocaleString()}</td>
                    <td>{item.saves}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleFeature(item.id)}
                        className={`${styles.iconBtn} ${item.featured ? styles.iconBtnActive : ''}`}
                        title={item.featured ? 'Unfeature' : 'Feature'}
                      >
                        <Star size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {tableListings.length === 0 && (
                  <tr>
                    <td colSpan="7" className={styles.emptyState}>No listings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div className={styles.usersSection}>
          <div className={styles.tableSectionHeader}>
            <h2>Recent Signups</h2>
            <span className={`${styles.tableCount} ${styles.liveTag}`}>● Live</span>
          </div>
          <div className={styles.userList}>
            {recentSignups.map((u, i) => (
              <div key={i} className={styles.userRow}>
                <img src={u.avatar} alt={u.name} className={styles.userAvatar} />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{u.name}</span>
                  <span className={styles.userEmail}>{u.email}</span>
                </div>
                <div className={styles.userMeta}>
                  <span className={styles.userJoined}><UserPlus size={13} /> {u.joined}</span>
                  <span className={styles.userListings}>{u.listings} listing{u.listings !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>

          {/* User stats */}
          <div className={styles.userStatsGrid}>
            <div className={styles.userStatCard}>
              <span className={styles.userStatNum}>8,421</span>
              <span className={styles.userStatLabel}>Total Registered Users</span>
            </div>
            <div className={styles.userStatCard}>
              <span className={styles.userStatNum}>3,201</span>
              <span className={styles.userStatLabel}>Verified Sellers</span>
            </div>
            <div className={styles.userStatCard}>
              <span className={styles.userStatNum}>142</span>
              <span className={styles.userStatLabel}>New This Week</span>
            </div>
            <div className={styles.userStatCard}>
              <span className={styles.userStatNum}>68%</span>
              <span className={styles.userStatLabel}>30-day Retention</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
