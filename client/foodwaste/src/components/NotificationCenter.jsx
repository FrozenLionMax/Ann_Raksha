import API_BASE, { API_URL } from '../config/api';
import { useEffect, useState } from "react";
import io from "socket.io-client";

function NotificationCenter() {
  // Added some mock notifications so it doesn't look empty when the socket hasn't fired
  const [notifications, setNotifications] = useState([
    { title: "Donation Matched!", description: "Your recent food donation was matched with Community Care Shelter.", type: "success" },
    { title: "Pickup Scheduled", description: "Food For All NGO will pick up your donation at 2:00 PM.", type: "info" }
  ]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") || "{}"
    );

    if (!userInfo?.token) return;

    const newSocket = io(
      API_BASE,
      {
        auth: {
          token: userInfo.token,
        },
      }
    );

    newSocket.on(
      "notification:new",
      (notification) => {
        setNotifications((prev) => [
          notification,
          ...prev,
        ]);
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="absolute top-12 right-0 w-80 z-50">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
          Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No notifications yet
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {notifications.map((n, index) => (
              <div
                key={index}
                className="border border-slate-100 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {n.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationCenter;