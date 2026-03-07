import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpertNotificationBell from "./ExpertNotificationBell";
import ExpertFeatures from "./ExpertFeatures";
import ExpertProfile from "./ExpertProfile";
import { getExpertProfile } from "../../api/expertApi";
import type { ExpertProfile as ExpertProfileType } from "../../types/serviceTypes";
import "./ExpertDashboard.css";

export default function ExpertDashboard() {
  const [profile, setProfile] = useState<ExpertProfileType | null>(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const refreshProfile = async () => {
    if (!userId) {
      return;
    }

    const res = await getExpertProfile(userId);
    setProfile(res.data);
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    refreshProfile();
  }, [userId]);

  if (!profile) {
    return <p className="expert-dashboard-loading">Loading...</p>;
  }

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="expert-dashboard-container">
      <div className="expert-topbar">
        <div className="expert-info">
          <span className="expert-name">{profile.user?.name}</span>
        </div>
        <h1 className="dashboard-title">Expert Dashboard</h1>
        <div className="topbar-actions">
          <ExpertNotificationBell />
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="expert-dashboard-content">
        {!profile.verified ? (
          <ExpertProfile profile={profile} refresh={refreshProfile} />
        ) : (
          <ExpertFeatures profile={profile} refresh={refreshProfile} />
        )}
      </div>
    </div>
  );
}
