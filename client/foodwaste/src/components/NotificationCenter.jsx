import { useEffect, useState } from "react";
import io from "socket.io-client";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (!userInfo?.token) return;

    const newSocket = io(
      "http://localhost:5000",
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
    <div className="fixed top-5 right-5 w-[350px] z-50">
      <div className="bg-white shadow-xl rounded-2xl p-5 border">

        <h2 className="text-xl font-bold mb-4">
          Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500">
            No notifications yet
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {notifications.map((n, index) => (
              <div
                key={index}
                className="border rounded-xl p-3 bg-gray-50"
              >
                <h3 className="font-semibold">
                  {n.title}
                </h3>

                <p className="text-sm text-gray-600">
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