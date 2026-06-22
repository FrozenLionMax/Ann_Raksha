const nodemailer = require('nodemailer');

let transporter = null;

try {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
} catch (e) {
  console.log('Email service not configured, using mock');
}

const FROM = process.env.EMAIL_FROM || 'Ann Raksha <noreply@annraksha.in>';

const template = (title, body) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:24px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">
  <div style="padding:32px 32px 16px;text-align:center;background:linear-gradient(135deg,rgba(16,185,129,0.1),transparent);">
    <h1 style="color:#10b981;font-size:20px;margin:0;">🌱 Ann Raksha</h1>
  </div>
  <div style="padding:24px 32px;">
    <h2 style="color:#ffffff;font-size:18px;margin:0 0 16px;">${title}</h2>
    <div style="color:#94a3b8;font-size:14px;line-height:1.6;">${body}</div>
  </div>
  <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
    <p style="color:#475569;font-size:11px;margin:0;">Built with ❤️ by Team Prizzm — Ayush & Khushi</p>
  </div>
</div>
</body></html>`;

async function sendEmail(to, subject, title, body) {
  if (!transporter) {
    console.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html: template(title, body) });
  } catch (e) {
    console.log(`📧 Email failed to ${to}:`, e.message);
  }
}

async function sendDonationClaimedEmail(donorEmail, donorName, donationTitle, ngoName) {
  await sendEmail(donorEmail, `Your donation "${donationTitle}" was claimed!`,
    'Donation Claimed! 🤝',
    `<p>Hey <strong>${donorName}</strong>,</p>
     <p>Great news! <strong>${ngoName}</strong> has claimed your donation "<strong>${donationTitle}</strong>".</p>
     <p>They'll coordinate pickup with you shortly. Thank you for making a difference!</p>
     <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:16px;margin-top:16px;text-align:center;">
       <p style="color:#10b981;font-weight:bold;margin:0;">Every meal you save is a life you touch. 🌟</p>
     </div>`
  );
}

async function sendDonationCompletedEmail(donorEmail, donorName, donationTitle, mealsProvided, co2Saved) {
  await sendEmail(donorEmail, `Donation "${donationTitle}" delivered!`,
    'Delivery Complete! 🎉',
    `<p>Hey <strong>${donorName}</strong>,</p>
     <p>Your donation "<strong>${donationTitle}</strong>" has been successfully delivered!</p>
     <div style="display:flex;gap:12px;margin:16px 0;">
       <div style="flex:1;background:rgba(16,185,129,0.1);border-radius:12px;padding:12px;text-align:center;">
         <p style="color:#10b981;font-size:24px;font-weight:bold;margin:0;">🍽️ ${mealsProvided}</p>
         <p style="color:#64748b;font-size:11px;margin:4px 0 0;">Meals Provided</p>
       </div>
       <div style="flex:1;background:rgba(16,185,129,0.1);border-radius:12px;padding:12px;text-align:center;">
         <p style="color:#10b981;font-size:24px;font-weight:bold;margin:0;">🌿 ${co2Saved.toFixed(1)}kg</p>
         <p style="color:#64748b;font-size:11px;margin:4px 0 0;">CO₂ Prevented</p>
       </div>
     </div>
     <p>Keep up the amazing work! 💪</p>`
  );
}

async function sendWelcomeEmail(email, name) {
  await sendEmail(email, 'Welcome to Ann Raksha! 🌱',
    `Welcome, ${name}! 🎉`,
    `<p>You've joined India's premier food rescue platform.</p>
     <p>Here's what you can do:</p>
     <ul style="color:#94a3b8;">
       <li>🍽️ Donate surplus food in under 2 minutes</li>
       <li>📊 Track your environmental impact in real-time</li>
       <li>🏆 Earn points, badges, and climb the leaderboard</li>
       <li>🗺️ Find donations near you on the live map</li>
     </ul>
     <p>Let's save meals together!</p>`
  );
}

module.exports = { sendDonationClaimedEmail, sendDonationCompletedEmail, sendWelcomeEmail };
