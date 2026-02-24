import { useEffect, useState } from "react";
import axios from "axios";
import "./VerifyExperts.css";

interface HomeService {
  id: number;
  name: string;
  category: string;
}

interface ExpertProfile {
  id: number; 
  services: HomeService[]; 
  pincode: string;
  address: string;
  trainingDone: boolean;
  verified: boolean;
  rejected?: boolean;

  user: {
    id: number;
    name: string;
  };
}

export default function VerifyExperts() {
  const [experts, setExperts] = useState<ExpertProfile[]>([]);

  const fetchExperts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/experts");

      const data: ExpertProfile[] = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      
      const completed = data.filter(
        (exp) =>
          exp.services &&
          exp.services.length > 0 && 
          exp.pincode &&
          exp.address &&
          exp.trainingDone === true,
      );

      setExperts(completed);
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const verify = async (id: number) => {
    await axios.patch(`http://localhost:8080/admin/experts/${id}/verify`);
    fetchExperts();
  };

  const reject = async (id: number) => {
    await axios.patch(`http://localhost:8080/admin/experts/${id}/reject`);
    fetchExperts();
  };

  return (
    <div id="verifyExpertsContainer">
      <h2>Expert Verification</h2>

      <div className="experts-grid">
        {experts.map((exp) => (
          <div key={exp.id} className="expert-card">
            <p className="expert-name">Name: {exp.user?.name}</p>

            
            <p>Services: {exp.services?.map((s) => s.name).join(", ")}</p>

            <p>Pincode: {exp.pincode}</p>
            <p>Address: {exp.address}</p>

            <p>Training: {exp.trainingDone ? "Completed" : "Pending"}</p>

       
            {exp.verified && (
              <span className="status-badge status-verified">Verified </span>
            )}

            {exp.rejected && (
              <span className="status-badge status-rejected">Rejected</span>
            )}

            {!exp.verified && !exp.rejected && (
              <div className="button-group">
                <button className="btn-verify" onClick={() => verify(exp.id)}>
                  Verify
                </button>

                <button className="btn-reject" onClick={() => reject(exp.id)}>
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
