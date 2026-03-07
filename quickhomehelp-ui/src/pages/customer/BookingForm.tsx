import { useState } from "react";
import "./BookingForm.css";
import { createCustomerBooking } from "../../api/customerApi";
import type { BookingFormProps } from "../../types/bookingTypes";

export default function BookingForm({ service, close }: BookingFormProps) {
  const [address, setAddress] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [pincodeError, setPincodeError] = useState<string>("");

  const book = async () => {
    if (!address || !pincode) {
      alert("Fill all fields");
      return;
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      setPincodeError("Enter a valid six digit pincode");
      return;
    }
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        return;
      }
      const res = await createCustomerBooking(userId, {
        serviceId: service.id,
        durationMinutes: service.baseDuration,
        address,
        pincode,
      });
      const booking = res.data;
      if (booking.status === "NO_EXPERT_AVAILABLE") {
        alert("No expert available at this time. Please try later.");
        return;
      }
      alert("Booking created successfully!");
      setAddress("");
      setPincode("");
      close();
    } catch {
      alert("Booking Failed");
    }
  };

  return (
    <div className="booking-form">
      <p className="booking-info">Duration: {service.baseDuration} mins</p>
      <p className="booking-price">Price: ₹{service.basePrice}</p>
      <input
        className="booking-input"
        placeholder="Enter Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        className="booking-input"
        placeholder="Enter Pincode"
        value={pincode}
        onChange={(e) => {
          const value = e.target.value;
          setPincode(value);
          const isValid = /^[0-9]{6}$/.test(value);
          if (!isValid && value.length > 0) {
            setPincodeError("Enter a valid six digit pincode");
          } else {
            setPincodeError("");
          }
        }}
      />
      {pincodeError && <p className="pincode-error">{pincodeError}</p>}
      <button className="confirm-booking-btn" onClick={book}>
        Confirm Booking
      </button>
    </div>
  );
}
