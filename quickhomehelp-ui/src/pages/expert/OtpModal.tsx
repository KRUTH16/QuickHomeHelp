import { useState } from "react";
import "./OtpModal.css";
import { verifyExpertJobOtp } from "../../api/expertApi";
import type { OtpModalProps } from "../../types/bookingTypes";

export default function OtpModal({ bookingId, close, refresh }: OtpModalProps) {

  const [otp, setOtp] = useState("");
  
  const verify = async () => {
    await verifyExpertJobOtp(bookingId, otp);
    alert("OTP Verified");
    refresh();
    close();
  };
  return (
    <div className="modal-overlay">
      <div className="otp-modal">
        <span className="close-btn" onClick={close}>
          X
        </span>
        <h3>Verify OTP</h3>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={verify}>Submit OTP</button>
      </div>
    </div>
  );
}
