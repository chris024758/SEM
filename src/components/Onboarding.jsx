import React, { useState } from 'react';
import { MapPin, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import styles from './Onboarding.module.css';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Kochi', 'Goa'];
const INTERESTS = [
  { label: 'Furniture', emoji: '🛋️' },
  { label: 'Electronics', emoji: '📷' },
  { label: 'Clothing', emoji: '👗' },
  { label: 'Books', emoji: '📚' },
  { label: 'Kitchen', emoji: '🍳' },
  { label: 'Home Decor', emoji: '🏺' },
  { label: 'Hobbies', emoji: '🎸' },
  { label: 'Art', emoji: '🎨' },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState([]);

  const toggleInterest = (label) => {
    setSelected(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);
  };

  const handleFinish = () => {
    localStorage.setItem('ss_onboarded', JSON.stringify({ city, interests: selected }));
    onComplete({ city, interests: selected });
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step / 2) * 100}%` }} />
        </div>

        {step === 1 && (
          <div className={styles.step}>
            <div className={styles.stepIcon}><MapPin size={28} /></div>
            <h2>Where are you based?</h2>
            <p>We'll show you listings near you first.</p>
            <div className={styles.cityGrid}>
              {CITIES.map(c => (
                <button
                  key={c}
                  className={`${styles.cityBtn} ${city === c ? styles.cityBtnActive : ''}`}
                  onClick={() => setCity(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              className={styles.nextBtn}
              onClick={() => setStep(2)}
              disabled={!city}
            >
              Continue <ChevronRight size={18} />
            </button>
            <button className={styles.skipBtn} onClick={() => setStep(2)}>Skip</button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <div className={styles.stepIcon}><Sparkles size={28} /></div>
            <h2>What are you into?</h2>
            <p>Pick any categories — we'll personalise your feed.</p>
            <div className={styles.interestGrid}>
              {INTERESTS.map(({ label, emoji }) => (
                <button
                  key={label}
                  className={`${styles.interestBtn} ${selected.includes(label) ? styles.interestBtnActive : ''}`}
                  onClick={() => toggleInterest(label)}
                >
                  <span className={styles.interestEmoji}>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
            <div className={styles.stepActions}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>
                <ChevronLeft size={18} /> Back
              </button>
              <button className={styles.nextBtn} onClick={handleFinish}>
                {selected.length > 0 ? `Start Exploring` : "Skip for now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
