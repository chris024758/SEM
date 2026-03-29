import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, PackageOpen } from 'lucide-react';
import { listings } from '../data/mockListings';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import styles from './Search.module.css';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Books', 'Clothing', 'Sports', 'Kitchen', 'Other'];
const CONDITIONS = ['All', 'New', 'Like New', 'Used - Good', 'Used - Fair'];
const SORTS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'];

const DEFAULT_FILTERS = {
  categories: ['All'],
  conditions: ['All'],
  minPrice: '',
  maxPrice: '',
  sortBy: 'Relevance'
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  
  // The local input string that hasn't been submitted to URL yet
  const [localQuery, setLocalQuery] = useState(rawQuery);

  // Filter Engine States
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  // Sync rawQuery from URL into local input box when user navigates
  useEffect(() => {
    setLocalQuery(rawQuery);
  }, [rawQuery]);

  // Simulate network loading when active queries/filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeFilters, rawQuery]);

  // --- Handlers --- //
  
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      const trimmed = localQuery.trim();
      if (trimmed) {
        setSearchParams({ q: trimmed });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleCheckboxToggle = (field, value) => {
    setDraftFilters(prev => {
      const currentList = prev[field];
      
      // If clicking 'All', reset to just 'All'
      if (value === 'All') {
        return { ...prev, [field]: ['All'] };
      }

      // If clicking a specific item
      let newArray = [];
      if (currentList.includes(value)) {
        // Remove it
        newArray = currentList.filter(v => v !== value);
        if (newArray.length === 0) newArray = ['All']; // Fallback to ALL
      } else {
        // Add it, but remove "All" if it was present
        newArray = [...currentList.filter(v => v !== 'All'), value];
      }

      return { ...prev, [field]: newArray };
    });
  };

  const applyFilters = () => {
    setActiveFilters(draftFilters);
  };

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setActiveFilters(DEFAULT_FILTERS);
    setLocalQuery('');
    setSearchParams({});
  };

  // --- Filter Core Engine --- //
  
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // 1. Text Search Map (Relevance)
      if (rawQuery) {
        const lowerQ = rawQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(lowerQ) && 
            !item.description.toLowerCase().includes(lowerQ) &&
            !item.category.toLowerCase().includes(lowerQ)) {
          return false;
        }
      }

      // 2. Categories
      if (!activeFilters.categories.includes('All')) {
        if (!activeFilters.categories.includes(item.category)) return false;
      }

      // 3. Conditions
      if (!activeFilters.conditions.includes('All')) {
        if (!activeFilters.conditions.includes(item.condition)) return false;
      }

      // 4. Price Limits
      if (activeFilters.minPrice && item.price < Number(activeFilters.minPrice)) return false;
      if (activeFilters.maxPrice && item.price > Number(activeFilters.maxPrice)) return false;

      return true;
    }).sort((a, b) => {
      // 5. Array Sorting
      if (activeFilters.sortBy === 'Price: Low to High') return a.price - b.price;
      if (activeFilters.sortBy === 'Price: High to Low') return b.price - a.price;
      if (activeFilters.sortBy === 'Newest') {
        // Mock data has "X days ago". Sort alphabetically or by length for prototype simplicity
        return a.postedAt.localeCompare(b.postedAt); 
      }
      return 0; // Relevance
    });
  }, [listings, activeFilters, rawQuery]);

  return (
    <div className={`page-wrapper ${styles.container}`}>
      <div className={styles.twoColumn}>
        
        {/* LEFT COMPONENT: SIDEBAR */}
        <aside className={styles.sidebar}>
          
          <div className={styles.filterSection}>
            <h3 className={styles.sectionHeader}>Category</h3>
            {CATEGORIES.map(cat => (
              <label key={cat} className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkboxInput}
                  checked={draftFilters.categories.includes(cat)}
                  onChange={() => handleCheckboxToggle('categories', cat)}
                />
                {cat}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.sectionHeader}>Condition</h3>
            {CONDITIONS.map(cond => (
              <label key={cond} className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkboxInput}
                  checked={draftFilters.conditions.includes(cond)}
                  onChange={() => handleCheckboxToggle('conditions', cond)}
                />
                {cond}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.sectionHeader}>Price Range</h3>
            <div className={styles.priceInputs}>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencyPrefix}>₹</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className={styles.priceInput}
                  value={draftFilters.minPrice}
                  onChange={(e) => setDraftFilters({...draftFilters, minPrice: e.target.value})}
                />
              </div>
              <span className={styles.priceSeparator}>-</span>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencyPrefix}>₹</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className={styles.priceInput}
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters({...draftFilters, maxPrice: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.sectionHeader}>Sort By</h3>
            {SORTS.map(sortOpt => (
              <label key={sortOpt} className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="sortCriteria"
                  className={styles.radioInput}
                  checked={draftFilters.sortBy === sortOpt}
                  onChange={() => setDraftFilters({...draftFilters, sortBy: sortOpt})}
                />
                {sortOpt}
              </label>
            ))}
          </div>

          <div className={styles.actionRow}>
            <button className={styles.applyBtn} onClick={applyFilters}>
              Apply Filters
            </button>
            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </aside>

        {/* RIGHT COMPONENT: MAIN GRID */}
        <main className={styles.mainContent}>
          
          <div className={styles.searchHeader}>
            <div className={styles.searchBarWrapper}>
              <SearchIcon className={styles.searchIcon} size={20} />
              <input 
                type="text"
                placeholder="Search vintage items..."
                className={styles.searchInput}
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>

            <div className={styles.resultsCount}>
              Showing <strong>{filteredListings.length}</strong> results {rawQuery && <span>for '<strong>{rawQuery}</strong>'</span>}
            </div>
          </div>

          {isLoading ? (
            <div className={styles.grid}>
              {Array(8).fill(0).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className={styles.grid}>
              {filteredListings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <PackageOpen size={64} className={styles.emptyIcon} strokeWidth={1} />
              <div className={styles.emptyTitle}>Nothing found</div>
              <p>Try adjusting your search or clearing some filters.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
