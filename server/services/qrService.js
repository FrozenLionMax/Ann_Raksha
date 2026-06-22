const QRCode = require('qrcode');

async function generateDonationQR(donationId, donorName, foodTitle) {
  const data = JSON.stringify({
    id: donationId,
    donor: donorName,
    food: foodTitle,
    timestamp: Date.now(),
    verifyUrl: `http://localhost:5000/api/donations/verify-qr/${donationId}`,
    platform: 'Ann Raksha',
  });
  const qrDataUrl = await QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: { dark: '#10b981', light: '#0f172a' },
    errorCorrectionLevel: 'H',
  });
  return qrDataUrl;
}

function verifyQRData(data) {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    if (!parsed.id || !parsed.platform || parsed.platform !== 'Ann Raksha') {
      return { valid: false, error: 'Invalid QR code' };
    }
    const age = Date.now() - parsed.timestamp;
    if (age > 24 * 60 * 60 * 1000) {
      return { valid: false, error: 'QR code expired (24h limit)' };
    }
    return { valid: true, donationId: parsed.id, donor: parsed.donor, food: parsed.food };
  } catch {
    return { valid: false, error: 'Malformed QR data' };
  }
}

module.exports = { generateDonationQR, verifyQRData };
