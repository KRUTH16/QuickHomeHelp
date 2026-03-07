import { useEffect, useState } from "react";
import "./VerifyExperts.css";
import {
  getExpertsForVerification,
  markExpertTrainingDone,
  rejectExpert,
  verifyExpert,
} from "../../api/adminApi";

import type { ExpertProfile } from "../../types/serviceTypes";

export default function VerifyExperts() {
  
  const [experts, setExperts] = useState<ExpertProfile[]>([]);

  const fetchExperts = async () => {
    try {
      const res = await getExpertsForVerification();

      const data: ExpertProfile[] = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setExperts(data);

    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);


  const markTrainingDone = async (id: number) => {
    try {
      await markExpertTrainingDone(id);
      fetchExperts();
    } catch (error) {
      console.error("Error marking training:", error);
    }
  };

  const verify = async (id: number) => {
    try {
      await verifyExpert(id);
      fetchExperts();
    } catch (error) {
      console.error("Error verifying expert:", error);
    }
  };

  const reject = async (id: number) => {
    try {
      await rejectExpert(id);
      fetchExperts();
    } catch (error) {
      console.error("Error rejecting expert:", error);
    }
  };

  
  return (
    <div id="verifyExpertsContainer">
      <h2>Expert Verification</h2>

      <div className="experts-grid">
        {experts.map((exp) => (
          <div key={exp.id} className="expert-card">

            <p className="expert-name">
              Name: {exp.user?.name}
            </p>

            <p>
              Services:{" "}
              {exp.services?.map((s) => s.name).join(", ")}
            </p>

            <p>Pincode: {exp.pincode}</p>
            <p>Address: {exp.address}</p>

            <p>
              <b>Training:</b>{" "}
              {exp.trainingDone
                ? "Completed"
                : "Pending"}
            </p>

            {exp.verified && (
              <span className="status-badge status-verified">
                Verified
              </span>
            )}

            {exp.rejected && (
              <span className="status-badge status-rejected">
                Rejected
              </span>
            )}


            {!exp.verified && !exp.rejected && (
  <div className="button-group">

    <button
      className="btn-training"
      disabled={exp.trainingDone}
      onClick={() => markTrainingDone(exp.id)}
    >
      {exp.trainingDone
        ? "Training Completed"
        : "Mark Training Done"}
    </button>

    <button
      className="btn-verify"
      disabled={!exp.trainingDone}
      onClick={() => verify(exp.id)}
    >
      Verify
    </button>

    <button
      className="btn-reject"
      onClick={() => reject(exp.id)}
    >
      Reject
    </button>

  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
}
