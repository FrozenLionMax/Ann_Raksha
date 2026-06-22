/**
 * #9 - Badge / Achievement System
 * Defines all badges and calculates which ones a user has earned
 */

const BADGES = [
  { id: 'first_donation', name: 'First Steps', emoji: '🌱', desc: 'Made your first donation', check: (s) => s.totalDonations >= 1, tier: 'bronze' },
  { id: 'five_donations', name: 'Rising Hero', emoji: '⭐', desc: 'Completed 5 donations', check: (s) => s.totalDonations >= 5, tier: 'bronze' },
  { id: 'ten_donations', name: 'Food Champion', emoji: '🏅', desc: 'Completed 10 donations', check: (s) => s.totalDonations >= 10, tier: 'silver' },
  { id: 'twenty_five', name: 'Impact Leader', emoji: '🏆', desc: 'Completed 25 donations', check: (s) => s.totalDonations >= 25, tier: 'gold' },
  { id: 'fifty_donations', name: 'Legend', emoji: '👑', desc: 'Completed 50 donations', check: (s) => s.totalDonations >= 50, tier: 'platinum' },
  { id: 'hundred_meals', name: 'Meal Saver', emoji: '🍽️', desc: 'Provided 100+ meals', check: (s) => s.mealsProvided >= 100, tier: 'silver' },
  { id: 'five_hundred_meals', name: 'Hunger Fighter', emoji: '💪', desc: 'Provided 500+ meals', check: (s) => s.mealsProvided >= 500, tier: 'gold' },
  { id: 'thousand_meals', name: 'Meal Master', emoji: '🔥', desc: 'Provided 1000+ meals', check: (s) => s.mealsProvided >= 1000, tier: 'platinum' },
  { id: 'co2_saver', name: 'Eco Warrior', emoji: '🌿', desc: 'Prevented 50+ kg CO₂', check: (s) => s.co2Saved >= 50, tier: 'silver' },
  { id: 'co2_champion', name: 'Planet Hero', emoji: '🌍', desc: 'Prevented 500+ kg CO₂', check: (s) => s.co2Saved >= 500, tier: 'gold' },
  { id: 'water_saver', name: 'Water Guardian', emoji: '💧', desc: 'Saved 10,000+ L water', check: (s) => s.waterSaved >= 10000, tier: 'silver' },
  { id: 'hundred_points', name: 'Point Hunter', emoji: '💎', desc: 'Earned 100+ impact points', check: (s) => s.points >= 100, tier: 'bronze' },
  { id: 'five_hundred_pts', name: 'Point Master', emoji: '💫', desc: 'Earned 500+ impact points', check: (s) => s.points >= 500, tier: 'gold' },
  { id: 'thousand_pts', name: 'Elite', emoji: '🌟', desc: 'Earned 1000+ impact points', check: (s) => s.points >= 1000, tier: 'platinum' },
];

const TIER_COLORS = {
  bronze: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', ring: 'ring-orange-400/30' },
  silver: { bg: 'bg-slate-300/10', text: 'text-slate-300', border: 'border-slate-300/20', ring: 'ring-slate-300/30' },
  gold: { bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/20', ring: 'ring-amber-400/30' },
  platinum: { bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/20', ring: 'ring-purple-400/30' },
};

function getUserBadges(impactStats, points = 0) {
  const stats = { ...impactStats, points };
  return BADGES.map(badge => ({
    ...badge,
    earned: badge.check(stats),
    colors: TIER_COLORS[badge.tier],
  }));
}

function BadgeGrid({ impactStats, points = 0, compact = false }) {
  const badges = getUserBadges(impactStats, points);
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div>
      {earned.length > 0 && (
        <div className={`grid ${compact ? 'grid-cols-4 gap-2' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3'}`}>
          {earned.map(badge => (
            <div key={badge.id}
              className={`${badge.colors.bg} border ${badge.colors.border} rounded-2xl p-3 text-center group hover:scale-105 transition-transform cursor-default`}
              title={badge.desc}
            >
              <div className="text-2xl mb-1">{badge.emoji}</div>
              <p className={`text-[10px] font-bold ${badge.colors.text} truncate`}>{badge.name}</p>
            </div>
          ))}
        </div>
      )}

      {!compact && locked.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Locked ({locked.length})</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {locked.slice(0, 10).map(badge => (
              <div key={badge.id}
                className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center opacity-30"
                title={badge.desc}
              >
                <div className="text-2xl mb-1 grayscale">🔒</div>
                <p className="text-[10px] font-bold text-slate-600 truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {earned.length === 0 && compact && (
        <p className="text-xs text-slate-500 italic">No badges yet — start donating!</p>
      )}
    </div>
  );
}

export { BADGES, TIER_COLORS, getUserBadges };
export default BadgeGrid;
