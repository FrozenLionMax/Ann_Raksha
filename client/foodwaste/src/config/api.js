// Central API configuration - all API calls use this base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URL = `${API_BASE}/api`;
export default API_BASE;
