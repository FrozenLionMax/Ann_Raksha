import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

export default function SocketManager() {
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('status_update', (data) => {
      // In a real app we'd check if this donation belongs to the user
      // For demo, we just show it
      
      let message = `Donation '${data.title}' status updated to ${data.status}`;
      let icon = '🔔';
      
      if (data.status === 'matched') {
        message = `Great news! Your donation '${data.title}' was just matched with an NGO.`;
        icon = '🤝';
      } else if (data.status === 'picked_up') {
        message = `Your donation '${data.title}' has been picked up.`;
        icon = '🚚';
      } else if (data.status === 'completed') {
        message = `Your donation '${data.title}' was completed successfully.`;
        icon = '✅';
      }

      toast(message, {
        icon: icon,
        style: {
          borderRadius: '16px',
          background: '#2F5D50',
          color: '#fff',
        },
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Toaster position="top-right" />;
}
