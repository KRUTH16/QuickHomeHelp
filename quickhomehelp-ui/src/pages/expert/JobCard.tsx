
import { useState, useEffect } from "react";
import axios from "axios";
import OtpModal from "./OtpModal";
import Payment from "./Payment";
import "./JobCard.css";

interface Review {
  stars: number;
  comment: string;
}

interface Job {
  id: number;
  address: string;
  pincode: string;
  amount: number;
  status: string;
  paymentStatus: string;
  durationMinutes?: number;
  duration?: number;
  duration_minutes?: number;
}

interface JobCardProps {
  job: Job;
  refresh: () => void;
}

export default function JobCard({
  job,
  refresh,
}: JobCardProps) {

  const [showOtp, setShowOtp] =
    useState<boolean>(false);

  const [timeLeft, setTimeLeft] =
    useState<number | null>(null);

  const [timerStarted, setTimerStarted] =
    useState<boolean>(false);

  const [paused, setPaused] =
    useState<boolean>(false);

  const [showReview, setShowReview] =
    useState<boolean>(false);

  const [decisionTimeLeft, setDecisionTimeLeft] =
    useState<number | null>(null);

  const [decisionExpired, setDecisionExpired] =
    useState<boolean>(false);

  const [review, setReview] =
    useState<Review | null>(null);

  const accept = async () => {
    await axios.patch(
      `http://localhost:8080/expert/bookings/${job.id}/accept`
    );
    refresh();
  };

  const reject = async () => {
    await axios.patch(
      `http://localhost:8080/expert/bookings/${job.id}/reject`
    );
    refresh();
  };

  const autoReject = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/expert/bookings/${job.id}/reject`
      );
      refresh();
    } catch {
      console.error("Auto reject failed");
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
    ) return;

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

  const updateStatus = async (status: string) => {
    await axios.patch(
      `http://localhost:8080/expert/bookings/${job.id}/status?status=${status}`
    );
    refresh();
  };

  const getDuration = (): number => {
    return (
      job.durationMinutes ||
      job.duration ||
      job.duration_minutes ||
      0
    );
  };

  const startTimer = () => {
    const duration = getDuration();
    if (!duration) return;
    setTimeLeft(duration * 60);
    setTimerStarted(true);
    setPaused(false);
  };

  useEffect(() => {
    if (job.status === "IN_PROGRESS" && !timerStarted) {
      const duration = getDuration();
      if (duration > 0) {
        setTimeLeft(duration * 60);
      }
    }
  }, [job.status, timerStarted]);

  useEffect(() => {
    if (!timerStarted || paused || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          updateStatus("COMPLETED");
          return 0;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, paused, timerStarted]);

  const formatTime = (): string => {
    if (timeLeft === null) return "";
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (job.status === "COMPLETED") {
      axios
        .get<Review>(
          `http://localhost:8080/ratings/booking/${job.id}`
        )
        .then((res) => {
          if (res.data) {
            setReview(res.data);
          }
        })
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
        <button
          className="otp-btn"
          onClick={() => setShowOtp(true)}
        >
          Verify OTP
        </button>
      )}

      {job.status === "IN_PROGRESS" && (
        <div className="progress-section">
          {!timerStarted && (
            <button
              className="start-btn"
              onClick={startTimer}
            >
              ▶ Start Timer
            </button>
          )}

          {timerStarted && (
            <p className="timer-text">
              Time Left: <b>{formatTime()}</b>
            </p>
          )}

          {timerStarted && (
            <div className="timer-actions">
              {!paused ? (
                <button
                  className="pause-btn"
                  onClick={() => setPaused(true)}
                >
                  Pause
                </button>
              ) : (
                <button
                  className="resume-btn"
                  onClick={() => setPaused(false)}
                >
                  Resume
                </button>
              )}
            </div>
          )}

          {timerStarted && (
            <button
              className="end-btn"
              onClick={() =>
                updateStatus("COMPLETED")
              }
            >
              End Job
            </button>
          )}
        </div>
      )}

      {job.status === "COMPLETED" && (
        <div className="completed-wrapper">
          <div className="completed-badge">
            Job Completed
          </div>
        </div>
      )}

      {job.status === "COMPLETED" && (
        <div className="completed-bottom">

          <div className="payment-area">
            {job.paymentStatus !== "PAID" && (
              <Payment
                bookingId={job.id}
                refresh={refresh}
              />
            )}
            {job.paymentStatus === "PAID" && (
              <div className="paid-label">
                Payment Collected
              </div>
            )}
          </div>

          {job.paymentStatus === "PAID" && (
            <div className="review-area">
              <button
                className="review-toggle-btn"
                onClick={() =>
                  setShowReview(!showReview)
                }
              >
                {showReview
                  ? "Hide Rating"
                  : "View Rating"}
              </button>

              {showReview && (
                review ? (
                  <div className="review-card">
                    <h4>⭐ {review.stars} / 5</h4>
                    <p>{review.comment}</p>
                  </div>
                ) : (
                  <p className="no-review">
                    No review yet
                  </p>
                )
              )}
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