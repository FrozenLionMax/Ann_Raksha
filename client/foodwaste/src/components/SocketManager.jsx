import API_BASE, { API_URL } from '../config/api';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { CheckCircle, Package, Bell, Truck } from 'lucide-react';

let socket = null;

export default function SocketManager() {
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (!userInfo) return;

    socket = io(API_BASE, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    // Real-time status updates
    socket.on('status_update', (data) => {
      const { status, title, donationId } = data;
      const messages = {
        matched: { msg: `"${title}" was claimed!`, icon: '🤝' },
        picked_up: { msg: `"${title}" is being picked up!`, icon: '🚚' },
        completed: { msg: `"${title}" delivery completed! 🎉`, icon: '✅' },
      };
      const info = messages[status] || { msg: `"${title}" status: ${status}`, icon: '📦' };
      toast(info.msg, {
        icon: info.icon,
        duration: 5000,
        style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' },
      });
    });

    // New donation alerts (for NGOs)
    socket.on('new_donation', (data) => {
      if (userInfo.role === 'ngo' || userInfo.role === 'receiver') {
        const title = data?.donation?.foodTitle || 'New Food';
        toast(`🆕 New donation available: "${title}"`, {
          duration: 6000,
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px' },
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  return null;
}

export { socket };
