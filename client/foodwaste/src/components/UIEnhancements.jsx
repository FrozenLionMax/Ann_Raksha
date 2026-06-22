import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

/**
 * #6 - Expiry Countdown Timer
 * Shows "Expires in 2h 30m" with ticking timer and urgency colors
 */
export function ExpiryCountdown({ expiryTime }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      let expiry;

      // Try parsing various formats
      if (expiryTime?.includes('T') || expiryTime?.includes('-')) {
        expiry = new Date(expiryTime);
      } else if (expiryTime?.match(/^\d+\s*(h|hr|hour)/i)) {
        const hours = parseInt(expiryTime);
        expiry = new Date(now.getTime() + hours * 3600000);
      } else {
        // Try as a time string like "6:00 PM" or "18:00"
        const today = new Date();
        const parts = expiryTime?.match(/(\d+):?(\d*)\s*(AM|PM)?/i);
        if (parts) {
          let h = parseInt(parts[1]);
          const m = parseInt(parts[2] || 0);
          if (parts[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
          if (parts[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
          expiry = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
          if (expiry < now) expiry.setDate(expiry.getDate() + 1);
        } else {
          return;
        }
      }

      const diff = expiry - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft('Expired');
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);

      setUrgent(h < 2);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };

    calcTime();
    const timer = setInterval(calcTime, 60000);
    return () => clearInterval(timer);
  }, [expiryTime]);

  if (!timeLeft) return <span className="text-xs text-slate-500">{expiryTime}</span>;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
      expired ? 'text-red-400' : urgent ? 'text-amber-400 animate-pulse' : 'text-slate-400'
    }`}>
      {expired ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {expired ? 'Expired' : `${timeLeft} left`}
    </span>
  );
}

/**
 * #7 - Animated Number Counter
 * Counts up from 0 to target value with easing
 */
export function AnimatedCounter({ value, duration = 2000, decimals = 0, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (target === 0) { setDisplay(0); return; }

    let start = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}

/**
 * #8 - Confetti Celebration Effect
 * Shows confetti particles when triggered
 */
export function Confetti({ active, duration = 3000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;

    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 4,
      speedY: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
    }));

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${2 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

/**
 * #10 - Social Share Card Generator
 * Generate a shareable impact card for social media
 */
export function ShareButton({ meals = 0, co2 = 0, donations = 0 }) {
  const handleShare = () => {
    const text = `🌱 My Ann Raksha Impact:\n\n🍽️ ${meals} meals provided\n🌿 ${co2.toFixed(1)} kg CO₂ prevented\n📦 ${donations} donations made\n\nJoin me in fighting food waste! #AnnRaksha #ZeroFoodWaste #SaveMeals`;

    if (navigator.share) {
      navigator.share({ title: 'My Ann Raksha Impact', text }).catch(() => {});
    } else {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <button onClick={handleShare}
      className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center gap-2"
    >
      📤 Share Impact
    </button>
  );
}
