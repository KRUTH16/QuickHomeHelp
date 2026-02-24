import { useState } from "react";
import axios from "axios";
import './OtpModal.css';

interface OtpModalProps {
  bookingId: number;
  close: () => void;
  refresh: () => void;
}

export default function OtpModal({
  bookingId,
  close,
  refresh,
}: OtpModalProps) {

  const [otp, setOtp] =
    useState("");

  const verify = async () => {

    await axios.post(
      `http://localhost:8080/expert/bookings/${bookingId}/verify-otp`,
      { otp }
    );

    alert("OTP Verified");

    refresh();
    close();
  };

  return (

    <div className="modal-overlay">

      <div className="otp-modal">

        <span
          className="close-btn"
          onClick={close}
        >
          ✖
        </span>

        <h3>Verify OTP</h3>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        <button onClick={verify}>
          Submit OTP
        </button>

      </div>

    </div>
  );
}
