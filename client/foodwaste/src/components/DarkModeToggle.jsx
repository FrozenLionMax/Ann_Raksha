import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsDark((d) => !d);
      }}
      aria-label="Toggle Dark Mode"
      style={{
        position: 'relative',
        width: 56,
        height: 30,
        borderRadius: 999,
        padding: 3,
        border: 'none',
        cursor: 'pointer',
        background: isDark ? '#1f2937' : '#bfdbfe',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.4s',
        outline: 'none',
      }}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? '#111827' : '#ffffff',
          color: isDark ? '#facc15' : '#f59e0b',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          x: isDark ? 26 : 0,
        }}
      >
        {isDark ? <Moon size={14} fill="currentColor" /> : <Sun size={14} fill="currentColor" />}
      </motion.div>
    </button>
  );
}
