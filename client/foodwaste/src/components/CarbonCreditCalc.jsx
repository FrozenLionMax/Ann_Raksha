import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Calculator, DollarSign, Trees } from 'lucide-react';

/**
 * #18 - Carbon Credit Calculator
 * Quantifies environmental impact into tradeable carbon credits
 */
export default function CarbonCreditCalc({ impactStats }) {
  const stats = impactStats || {};
  const co2 = stats.co2Saved || 0;
  const water = stats.waterSaved || 0;
  const meals = stats.mealsProvided || 0;

  // 1 carbon credit = 1 tonne CO2 = 1000 kg
  const carbonCredits = co2 / 1000;
  // Average carbon credit price in India ~$10-15
  const creditValue = carbonCredits * 12;
  // Trees equivalent: 1 tree absorbs ~22 kg CO2 per year
  const treesEquivalent = Math.round(co2 / 22);
  // Driving equivalent: avg car emits 0.21 kg CO2 per km
  const drivingKm = Math.round(co2 / 0.21);
  // Electricity: 0.92 kg CO2 per kWh in India
  const electricityHours = Math.round(co2 / 0.092);

  const metrics = [
    { label: 'Carbon Credits', value: carbonCredits.toFixed(3), unit: 'tonnes', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Tradeable on carbon markets' },
    { label: 'Credit Value', value: `$${creditValue.toFixed(2)}`, unit: 'USD', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'At current market rates' },
    { label: 'Trees Equivalent', value: treesEquivalent, unit: 'trees/year', icon: Trees || Leaf, color: 'text-green-400', bg: 'bg-green-500/10', desc: 'Annual CO₂ absorption' },
    { label: 'Driving Offset', value: drivingKm.toLocaleString(), unit: 'km saved', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Equivalent car emissions' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Carbon Credit Calculator</h3>
          <p className="text-xs text-slate-500">Your environmental impact quantified</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${m.bg} border border-white/5 rounded-xl p-4`}
          >
            <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
            <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{m.unit}</p>
            <p className="text-[10px] text-slate-600 mt-1">{m.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
        <p className="text-xs text-slate-400 leading-relaxed">
          💡 <strong className="text-emerald-400">Methodology:</strong> CO₂ is calculated at 2.5 kg per kg of food rescued (UNEP standard).
          Carbon credits are priced at the current Indian VCS market rate of ~$12/tonne.
        </p>
      </div>
    </motion.div>
  );
}
