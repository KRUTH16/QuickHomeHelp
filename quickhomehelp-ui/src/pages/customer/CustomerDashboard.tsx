import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerDashboard.css";
import BrowseServices from "./BrowserServices";
import MyBookings from "./MyBookings";
import NotificationBell from "./NotificationBell";

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CustomerDashboard() {
  const [page, setPage] = useState("services");

  const [customer, setCustomer] = useState<Customer | null>(null);

  const userId = sessionStorage.getItem("userId");

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await axios.get(`http://localhost:8080/customer/${userId}`);

      setCustomer(res.data);
    };

    if (userId) fetchCustomer();
  }, [userId]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="customer-dashboard">
      <div className="customer-topbar">
        <div className="customer-info">👤 {customer.name}</div>

        <h1 className="dashboard-title">Customer Dashboard</h1>

        <div className="topbar-right">
          <NotificationBell />

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="customer-body">
        <div className="customer-sidebar">
          <button onClick={() => setPage("services")}>Browse Services</button>

          <button onClick={() => setPage("bookings")}>My Bookings</button>
        </div>

        <div className="customer-content">
          {page === "services" && <BrowseServices />}

          {page === "bookings" && <MyBookings />}
        </div>
      </div>
    </div>
  );
}
