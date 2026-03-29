import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import styles from './PostListing.module.css';

export default function PostListing() {
  // Field States
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [condition, setCondition] = useState('Like New');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  // UI States
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  // Constants
  const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Clothing', 'Sports', 'Kitchen', 'Other'];
  const CONDITIONS = ['New', 'Like New', 'Used - Good', 'Used - Fair'];
  const MAX_IMAGES = 10;

  // --- Handlers: Drag & Drop ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    // We create ObjectURLs for instant frontend preview
    const newImages = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setImages(prev => {
      const combined = [...prev, ...newImages];
      if (combined.length > MAX_IMAGES) {
        alert(`You can only upload up to ${MAX_IMAGES} photos.`);
        return combined.slice(0, MAX_IMAGES);
      }
      return combined;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input so re-selecting same file works
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // --- Handlers: Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      category,
      condition,
      description,
      price: Number(price),
      location,
      imagesCount: images.length,
      // We wouldn't log out massive data blobs in real life, just mock it
      imageUrls: images.map(i => i.url) 
    };

    console.log("🔥 NEW LISTING CREATED:", payload);

    // Show Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Reset Form
    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setImages([]);
    setCategory('Furniture');
    setCondition('Like New');
    window.scrollTo(0, 0);
  };

  return (
    <div className={`page-wrapper ${styles.container}`}>
      <h1 className={styles.pageTitle}>List something new</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* SECTION 1: PHOTOS */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Photos</div>
          <div 
            className={`${styles.dropzone} ${isDragging ? styles.active : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className={styles.uploadIcon} size={48} />
            <div className={styles.dropzoneText}>Drop photos here or click to browse</div>
            <div className={styles.dropzoneSubtext}>Max {MAX_IMAGES} photos (JPEG, PNG, WEBP)</div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              className={styles.fileInput} 
              onChange={handleFileChange}
            />
          </div>

          {images.length > 0 && (
            <div className={styles.previewGrid}>
              {images.map((img, idx) => (
                <div key={img.url} className={styles.previewItem}>
                  <img src={img.url} alt={`Preview ${idx}`} className={styles.previewImage} />
                  <button 
                    type="button" 
                    className={styles.removeImageBtn} 
                    onClick={() => removeImage(idx)}
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: ITEM DETAILS */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Item Details</div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Vintage Teak Dining Chair" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Condition</label>
              <select 
                className={styles.select}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {CONDITIONS.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Describe what you're selling. Make it sound appealing!"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* SECTION 3: PRICING & LOCATION */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Pricing & Location</div>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Price</label>
              <div className={styles.priceWrapper}>
                <span className={styles.currencyPrefix}>₹</span>
                <input 
                  type="number" 
                  min="0"
                  className={`${styles.input} ${styles.priceInput}`} 
                  placeholder="0" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Location</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Pune, MH" 
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Post Listing
        </button>
      </form>

      {/* SUCCESS TOAST */}
      {showToast && (
        <div className={styles.toast}>
          <CheckCircle2 size={20} />
          Your listing is live!
        </div>
      )}
    </div>
  );
}
