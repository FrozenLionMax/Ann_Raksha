import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, Share2, Calendar } from 'lucide-react';

/**
 * #13 - Impact Certificate Generator
 * Generates a shareable impact certificate for donors
 */
export default function ImpactCertificate({ userName, impactStats, points }) {
  const [generating, setGenerating] = useState(false);

  const stats = impactStats || {};
  const meals = stats.mealsProvided || 0;
  const co2 = (stats.co2Saved || 0).toFixed(1);
  const water = ((stats.waterSaved || 0) / 1000).toFixed(1);
  const donations = stats.totalDonations || 0;
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const generatePDF = () => {
    setGenerating(true);

    // Create a canvas-based certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.strokeStyle = 'rgba(16,185,129,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 720);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('ANN RAKSHA FOOD RESCUE PLATFORM', 600, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Georgia';
    ctx.fillText('Certificate of Impact', 600, 150);

    // Divider
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 175);
    ctx.lineTo(850, 175);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Arial';
    ctx.fillText('This certificate is proudly awarded to', 600, 230);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px Georgia';
    ctx.fillText(userName || 'Food Hero', 600, 280);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Arial';
    ctx.fillText('for making an outstanding contribution to food rescue', 600, 320);
    ctx.fillText('and fighting hunger in communities across India.', 600, 345);

    // Stats
    const statsData = [
      { label: 'Meals Provided', value: meals.toLocaleString(), emoji: '🍽️' },
      { label: 'CO₂ Prevented', value: `${co2} kg`, emoji: '🌿' },
      { label: 'Water Saved', value: `${water}K L`, emoji: '💧' },
      { label: 'Donations', value: donations.toString(), emoji: '📦' },
    ];

    const startX = 150;
    statsData.forEach((stat, i) => {
      const x = startX + i * 250;
      ctx.fillStyle = 'rgba(16,185,129,0.1)';
      ctx.fillRect(x, 400, 200, 90);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(`${stat.emoji} ${stat.value}`, x + 100, 440);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.fillText(stat.label, x + 100, 470);
    });

    // Points
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`⭐ ${points || 0} Impact Points Earned`, 600, 550);

    // Date & ID
    ctx.fillStyle = '#475569';
    ctx.font = '14px Arial';
    ctx.fillText(`Issued: ${date}`, 600, 620);
    ctx.fillText(`Certificate ID: AR-${Date.now().toString(36).toUpperCase()}`, 600, 645);

    // Footer
    ctx.fillStyle = '#334155';
    ctx.font = '12px Arial';
    ctx.fillText('Ann Raksha — Built with ❤️ by Team Prizzm | BuildX\'26', 600, 720);
    ctx.fillText('Ayush Kushwaha & Khushi Pandey', 600, 740);

    // Download
    const link = document.createElement('a');
    link.download = `AnnRaksha_Impact_Certificate_${userName?.replace(/\s/g, '_') || 'User'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setGenerating(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <Award className="w-6 h-6 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Impact Certificate</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        Download your personalized impact certificate to share with your community.
      </p>
      <div className="flex gap-3">
        <button onClick={generatePDF} disabled={generating}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {generating ? 'Generating...' : 'Download Certificate'}
        </button>
      </div>
    </motion.div>
  );
}
