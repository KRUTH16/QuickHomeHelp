import { useEffect, useState, useCallback } from "react";
import "./ExpertNotificationBell.css";
import {
  getExpertNotifications,
  markExpertNotificationsRead,
} from "../../api/expertApi";
import type { Notification } from "../../types/bookingTypes";

export default function ExpertNotificationBell() {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const userId: string | null = sessionStorage.getItem("userId");

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      return;
    }
    const res = await getExpertNotifications(userId);
    setNotifications(res.data);
  }, [userId]);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  const handleClick = async () => {
    const newState = !open;
    setOpen(newState);

    if (!open && userId) {
      await markExpertNotificationsRead(userId);
      await fetchNotifications();
    }

  };

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  return (
    <div className="bell" onClick={handleClick}>
      🔔 {unreadCount > 0 && unreadCount}
      {open && (
        <div className="dropdown">
          {notifications.length === 0 && <div>No notifications</div>}
          {notifications.map((n) => (
            <div key={n.id}>{n.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}
