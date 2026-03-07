import { useState, useEffect } from "react";
import OtpModal from "./OtpModal";
import Payment from "./Payment";
import "./JobCard.css";

import {
  acceptExpertJob,
  completeExpertJob,
  getBookingRating,
  pauseExpertJob,
  rejectExpertJob,
  resumeExpertJob,
  startExpertJob,
} from "../../api/expertApi";

import type { JobCardProps } from "../../types/bookingTypes";
import type { Review } from "../../types/ratingTypes";

export default function JobCard({ job, refresh }: JobCardProps) {
  
  const [showOtp, setShowOtp] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [decisionTimeLeft, setDecisionTimeLeft] = useState<number | null>(null);
  const [decisionExpired, setDecisionExpired] = useState(false);
  const [review, setReview] = useState<Review | null>(null);

  const accept = async () => {
    await acceptExpertJob(job.id);
    refresh();
  };
  const reject = async () => {
    await rejectExpertJob(job.id);
    refresh();
  };
  const autoReject = async () => {
    try {
      await rejectExpertJob(job.id);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (job.status === "ASSIGNED") {
      setDecisionTimeLeft(30);
      setDecisionExpired(false);
    }
  }, [job.status]);

  useEffect(() => {
    if (
      decisionTimeLeft === null ||
      decisionExpired ||
      job.status !== "ASSIGNED"
    ) {
      return;
    }
    const timer = setInterval(() => {
      setDecisionTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          autoReject();
          setDecisionExpired(true);
          return 0;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [decisionTimeLeft, decisionExpired, job.status]);

  const startJob = async () => {
    await startExpertJob(job.id);
    refresh();
  };
  const pauseJob = async () => {
    await pauseExpertJob(job.id);
    refresh();
  };
  const resumeJob = async () => {
    await resumeExpertJob(job.id);
    refresh();
  };
  const completeJob = async () => {
    await completeExpertJob(job.id);
    refresh();
  };

  useEffect(() => {
    if (job.status !== "IN_PROGRESS" || !job.startTime) {
      return;
    }
    const interval = setInterval(() => {
      const start = new Date(job.startTime!).getTime();
      const now = Date.now();
      const paused = (job.pausedSeconds ?? 0) * 1000;
      let elapsed = now - start - paused;
      
      if (job.pauseTime) {
        elapsed = new Date(job.pauseTime).getTime() - start - paused;
      }
      setElapsedSeconds(Math.floor(elapsed / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [job]);

  const formatTime = () => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };


  useEffect(() => {
    if (job.status === "COMPLETED") {
      getBookingRating(job.id)
        .then((res) => res.data && setReview(res.data))
        .catch(() => {});
    }
  }, [job.status, job.id]);


  return (
    <div className="job-card">
      <h3>Booking ID: {job.id}</h3>
      <p>Address: {job.address}</p>
      <p>Pincode: {job.pincode}</p>
      <p>Amount: ₹{job.amount}</p>
      <p>Status: {job.status}</p>
      {job.status === "ASSIGNED" && (
        <div className="job-actions">
          {decisionTimeLeft !== null && (
            <p className="decision-timer">
              Accept within: <b>{decisionTimeLeft}s</b>
            </p>
          )}
          <button
            className="accept-btn"
            onClick={accept}
            disabled={decisionExpired}
          >
            Accept
          </button>
          <button
            className="reject-btn"
            onClick={reject}
            disabled={decisionExpired}
          >
            Reject
          </button>
        </div>
      )}
      {job.status === "ACCEPTED" && (
        <button className="otp-btn" onClick={() => setShowOtp(true)}>
          Verify OTP
        </button>
      )}
      {job.status === "IN_PROGRESS" && (
        <div className="progress-section">
          {!job.startTime && (
            <button className="start-btn" onClick={startJob}>
              ▶ Start Job
            </button>
          )}
          {job.startTime && (
            <>
              <p className="timer-text">
                Timer: <b>{formatTime()}</b>
              </p>
              <div className="timer-actions">
                {!job.pauseTime ? (
                  <button className="pause-btn" onClick={pauseJob}>
                    Pause
                  </button>
                ) : (
                  <button className="resume-btn" onClick={resumeJob}>
                    Resume
                  </button>
                )}
              </div>
              <button className="end-btn" onClick={completeJob}>
                End Job
              </button>
            </>
          )}
        </div>
      )}
      {job.status === "COMPLETED" && (
        <div className="completed-wrapper">
          <div className="completed-badge">Job Completed</div>
        </div>
      )}
      {job.status === "COMPLETED" && (
        <div className="completed-bottom">
          <div className="payment-area">
            {job.paymentStatus !== "PAID" ? (
              <Payment
                bookingId={job.id}
                amount={job.amount}
                refresh={refresh}
              />
            ) : (
              <div className="paid-label">Payment Collected</div>
            )}
          </div>
          {job.paymentStatus === "PAID" && (
            <div className="review-area">
              <button
                className="review-toggle-btn"
                onClick={() => setShowReview(!showReview)}
              >
                {showReview ? "Hide Rating" : "View Rating"}
              </button>
              {showReview &&
                (review ? (
                  <div className="review-card">
                    <h4>⭐ {review.stars} / 5</h4>
                    <p>{review.comment}</p>
                  </div>
                ) : (
                  <p className="no-review">No review yet</p>
                ))}
            </div>
          )}
        </div>
      )}
      {showOtp && (
        <OtpModal
          bookingId={job.id}
          close={() => setShowOtp(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
}
