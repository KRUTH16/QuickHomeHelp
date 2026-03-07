import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "./JobCard";
import "./AssignedJobs.css";
import { getExpertJobs } from "../../api/expertApi";
import type { Job } from "../../types/bookingTypes";

const STATUS_OPTIONS = [
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
] as const;

type JobStatus = (typeof STATUS_OPTIONS)[number]["value"];

type AssignedJobsProps = {
  title?: string;
  defaultStatus?: JobStatus;
  allowedStatuses?: JobStatus[];
  syncStatusWithQuery?: boolean;
};

export default function AssignedJobs({
  title = "Assigned Jobs",
  defaultStatus = "ASSIGNED",
  allowedStatuses,
  syncStatusWithQuery = false,
}: AssignedJobsProps) {
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const expertId = sessionStorage.getItem("userId");
  const [searchParams, setSearchParams] = useSearchParams();

  const statusOptions = STATUS_OPTIONS.filter(
    ({ value }) => !allowedStatuses || allowedStatuses.includes(value),
  );

  const fallbackStatus = statusOptions[0]?.value ?? defaultStatus;
  const queryStatus = searchParams.get("status")?.toUpperCase() as
    | JobStatus
    | undefined;
  const validQueryStatus = queryStatus
    ? statusOptions.some(({ value }) => value === queryStatus)
    : false;
  const initialStatus = syncStatusWithQuery
    ? validQueryStatus
      ? queryStatus!
      : fallbackStatus
    : fallbackStatus;
    
  const [status, setStatus] = useState<JobStatus>(initialStatus);

  const fetchJobs = async () => {
    if (!expertId) {
      return;
    }
    const res = await getExpertJobs(expertId, status);
    setJobs(res.data);
  };

  useEffect(() => {
    if (!syncStatusWithQuery) {
      return;
    }

    if (queryStatus && validQueryStatus && queryStatus !== status) {
      setStatus(queryStatus);
      return;
    }

    if (!validQueryStatus) {
      setSearchParams({ status: fallbackStatus.toLowerCase() }, { replace: true });
      setStatus(fallbackStatus);
    }
  }, [
    fallbackStatus,
    queryStatus,
    setSearchParams,
    status,
    syncStatusWithQuery,
    validQueryStatus,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [status]);

  const onChangeStatus = (nextStatus: JobStatus) => {
    setStatus(nextStatus);
    if (syncStatusWithQuery) {
      setSearchParams({ status: nextStatus.toLowerCase() });
    }
  };

  return (
    <div className="expert-jobs-container">
      <h2>{title}</h2>
      {statusOptions.length > 1 && (
        <div className="job-filters">
          {statusOptions.map(({ label, value }) => (
            <button
              key={value}
              className={status === value ? "filter-btn active" : "filter-btn"}
              onClick={() => onChangeStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} refresh={fetchJobs} />
        ))}
      </div>
    </div>
  );
}
