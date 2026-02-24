

import { useEffect, useState } from "react";
import axios from "axios";

import ExpertProfile from "./ExpertProfile";
import ExpertFeatures from "./ExpertFeatures";
import ExpertNotificationBell from "./ExpertNotificationBell";
import "./ExpertDashboard.css";

interface Service {
  id: number;
  name: string;
  category: string;
}

interface User {
  id: number;
  name: string;
}

interface ExpertProfileType {
  user: User;
  services: Service[];
  pincode: string;
  address: string;
  trainingDone: boolean;
  verified: boolean;
  online: boolean;
}

export default function ExpertDashboard() {

  const [profile, setProfile] =
    useState<ExpertProfileType | null>(null);

  const userId: string | null =
    localStorage.getItem("userId");

  const fetchProfile = async () => {

    if (!userId) return;

    const res = await axios.get<ExpertProfileType>(
      `http://localhost:8080/expert/profile/${userId}`
    );

    setProfile(res.data);
  };

  useEffect(() => {

    if (!userId) return;

    fetchProfile();

  }, [userId]);

  if (!profile)
    return (
      <p className="expert-dashboard-loading">
        Loading...
      </p>
    );

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (

    <div className="expert-dashboard-container">

      <div className="expert-topbar">

        <div className="expert-info">

          <div className="profile-icon">
            👤
          </div>

          <span className="expert-name">
            {profile.user?.name}
          </span>

        </div>

        <h1 className="dashboard-title">
          Expert Dashboard
        </h1>

        <div className="topbar-actions">

          <ExpertNotificationBell />

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

      <div className="expert-dashboard-content">

        {!profile.verified ? (

          <ExpertProfile
            profile={profile}
            refresh={fetchProfile}
          />

        ) : (

          <ExpertFeatures
            profile={profile}
            refresh={fetchProfile}
          />

        )}

      </div>

    </div>
  );
}