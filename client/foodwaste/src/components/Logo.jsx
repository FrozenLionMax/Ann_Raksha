import React from 'react';
import { ShieldCheck, Wheat } from 'lucide-react';

export default function Logo({ className = '', size = 'md' }) {
  // Size variants
  const variants = {
    sm: { iconContainer: 'w-8 h-8 rounded-lg', icon1: 20, icon2: 12, text: 'text-lg', gap: 'gap-2' },
    md: { iconContainer: 'w-10 h-10 rounded-xl', icon1: 24, icon2: 14, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { iconContainer: 'w-14 h-14 rounded-2xl', icon1: 34, icon2: 20, text: 'text-4xl', gap: 'gap-3.5' },
    xl: { iconContainer: 'w-20 h-20 rounded-3xl', icon1: 48, icon2: 28, text: 'text-5xl', gap: 'gap-5' }
  };

  const v = variants[size] || variants.md;

  return (
    <div className={`flex items-center ${v.gap} ${className}`}>
      {/* Icon Container with gradient and shadow */}
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-400 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/40 flex-shrink-0 transition-transform hover:scale-105 duration-300 ${v.iconContainer}`}>
        <ShieldCheck className="absolute text-white/90" size={v.icon1} strokeWidth={1.5} />
        <Wheat className="absolute text-slate-50 drop-shadow-md" size={v.icon2} strokeWidth={2.5} style={{ transform: 'translateY(2px)' }} />
      </div>
      
      {/* Text Container */}
      <div className="flex flex-col justify-center">
        <span className={`${v.text} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-700 dark:from-white dark:to-emerald-400`} style={{ fontFamily: "'Inter', sans-serif" }}>
          Ann Raksha
        </span>
      </div>
    </div>
  );
}
