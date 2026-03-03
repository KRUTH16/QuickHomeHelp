
import { useState } from "react";
import axios from "axios";
import AssignedJobs from "./AssignedJobs";
import "./ExpertFeatures.css";

interface ExpertProfile {
  id: number;
  online: boolean;
}

interface ExpertFeaturesProps {
  profile: ExpertProfile;
  refresh: () => void;
}

export default function ExpertFeatures({
  profile,
  refresh,
}: ExpertFeaturesProps) {

  const [page] =
    useState("jobs");

  const toggle = async (
    status: boolean
  ) => {

    await axios.patch(
      `http://localhost:8080/expert/profile/${profile.id}/online?status=${status}`
    );

    refresh();
  };

  return (

    <div className="expert-features-container">

      <h3>Service Provider Panel</h3>

      <div className="online-toggle">

        <p>
          Status:{" "}
          <span
            className={
              profile.online
                ? "status-online"
                : "status-offline"
            }
          >
            {profile.online
              ? "Online"
              : "Offline"}
          </span>
        </p>

        <button
          className="toggle-btn btn-online"
          onClick={() => toggle(true)}
          disabled={profile.online}
        >
          Go Online
        </button>

        <button
          className="toggle-btn btn-offline"
          onClick={() => toggle(false)}
          disabled={!profile.online}
        >
          Go Offline
        </button>

      </div>



      <div className="expert-feature-content">

        {page === "jobs" && (
         <AssignedJobs/>
        )}

        {page === "accept" && (
         <AssignedJobs/>
        )}

        {page === "status" && (
           <AssignedJobs/>
        )}

        {page === "otp" && (
           <AssignedJobs/>
        )}

      </div>

    </div>
  );
}

