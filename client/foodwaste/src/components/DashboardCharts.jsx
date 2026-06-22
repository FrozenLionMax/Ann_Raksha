import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * #4 - Dashboard Analytics Charts
 * Donation trends, food type distribution, and weekly activity
 */

// Generate sample weekly data based on actual stats
function generateWeeklyData(totalDonations = 0) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = Math.max(1, Math.floor(totalDonations / 7));
  return days.map((day, i) => ({
    day,
    donations: Math.floor(base * (0.5 + Math.random())),
    meals: Math.floor(base * (2 + Math.random() * 3)),
  }));
}

const FOOD_TYPES = [
  { name: 'Cooked', value: 35, color: '#10b981' },
  { name: 'Raw', value: 20, color: '#3b82f6' },
  { name: 'Packaged', value: 15, color: '#f59e0b' },
  { name: 'Bakery', value: 12, color: '#ec4899' },
  { name: 'Fruits', value: 10, color: '#8b5cf6' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

const customTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  fontSize: '12px',
  padding: '8px 12px',
};

export function DonationTrendChart({ totalDonations = 0 }) {
  const data = generateWeeklyData(totalDonations);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
      <h3 className="text-sm font-bold text-white mb-4">Weekly Donation Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={2} fill="url(#colorDonations)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MealsBarChart({ totalDonations = 0 }) {
  const data = generateWeeklyData(totalDonations);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
      <h3 className="text-sm font-bold text-white mb-4">Meals Served This Week</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Bar dataKey="meals" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FoodTypePieChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
      <h3 className="text-sm font-bold text-white mb-4">Food Type Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={FOOD_TYPES}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {FOOD_TYPES.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {FOOD_TYPES.map((t, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
            {t.name}
          </div>
        ))}
      </div>
    </div>
  );
}
