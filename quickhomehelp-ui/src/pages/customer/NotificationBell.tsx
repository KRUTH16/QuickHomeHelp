

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Notification {
  id: number;
  message: string;
  readStatus: boolean;
}

export default function NotificationBell() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [open, setOpen] =
    useState<boolean>(false);

  const userId: string | null =
    localStorage.getItem("userId");

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    const res = await axios.get(
      `http://localhost:8080/notifications/${userId}`
    );

    setNotifications(res.data);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClick = async () => {

    const newState = !open;
    setOpen(newState);

    if (!open && userId) {

      await axios.patch(
        `http://localhost:8080/notifications/read-all/${userId}`
      );

      await fetchNotifications();
    }
  };

  const unreadCount =
    notifications.filter(n => !n.readStatus).length;

  return (

    <div className="bell" onClick={handleClick}>

      🔔 {unreadCount > 0 && unreadCount}

      {open && (

        <div className="dropdown">

          {notifications.length === 0 && (
            <div>No notifications</div>
          )}

          {notifications.map(n => (

            <div key={n.id}>
              {n.message}
            </div>

          ))}

        </div>

      )}

    </div>

  );
}