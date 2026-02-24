import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import "./AssignedJobs.css";



export default function ExpertJobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  const expertId = localStorage.getItem("userId");

  const [status, setStatus] = useState("ASSIGNED");

  const fetchJobs = async () => {
    const res = await axios.get(
      `http://localhost:8080/expert/bookings?expertId=${expertId}&status=${status}`,
    );

    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, [status]);

  return (
    <div className="expert-jobs-container">
      <h2>Assigned Jobs</h2>

      <div className="job-filters">
        <button
          className={status === "ASSIGNED" ? "filter-btn active" : "filter-btn"}
          onClick={() => setStatus("ASSIGNED")}
        >
          Assigned
        </button>

        <button
          className={status === "ACCEPTED" ? "filter-btn active" : "filter-btn"}
          onClick={() => setStatus("ACCEPTED")}
        >
          Accepted
        </button>

        <button
          className={
            status === "IN_PROGRESS" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setStatus("IN_PROGRESS")}
        >
          In Progress
        </button>

        <button
          className={
            status === "COMPLETED" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setStatus("COMPLETED")}
        >
          Completed
        </button>
      </div>

      {/* JOB LIST */}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} refresh={fetchJobs} />
        ))}
      </div>
    </div>
  );
}
