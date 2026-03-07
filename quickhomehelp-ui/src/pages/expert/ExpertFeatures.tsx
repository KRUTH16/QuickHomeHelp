import AssignedJobs from "./AssignedJobs";
import "./ExpertFeatures.css";
import { setExpertOnlineStatus } from "../../api/expertApi";
import type { ExpertProfile } from "../../types/serviceTypes";

type ExpertFeaturesProps = {
  profile: ExpertProfile;
  refresh: () => Promise<void>;
};

export default function ExpertFeatures({
  profile,
  refresh,
}: ExpertFeaturesProps) {
  
  const toggle = async (status: boolean) => {
    await setExpertOnlineStatus(profile.id, status);
    await refresh();
  };

  return (
    <div className="expert-features-container">
      <h3>Service Provider Panel</h3>
      <div className="online-toggle">
        <p>
          Status:{" "}
          <span className={profile.online ? "status-online" : "status-offline"}>
            {profile.online ? "Online" : "Offline"}
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
        <AssignedJobs title="Jobs" syncStatusWithQuery />
      </div>
    </div>
  );
}
