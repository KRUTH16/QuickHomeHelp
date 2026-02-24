
import { useState } from "react";
import axios from "axios";
import DurationSelector from "./DurationSelector";
import "./BookingForm.css";

interface Service {
  id: number;
  baseDuration: number;
  basePrice: number;
}

interface BookingFormProps {
  service: Service;
  close: () => void;
}

export default function BookingForm({
  service,
  close,
}: BookingFormProps) {

  const [duration, setDuration] =
    useState<number>(service.baseDuration);

  const [address, setAddress] =
    useState<string>("");

  const [pincode, setPincode] =
    useState<string>("");

  const price =
    (duration / service.baseDuration) *
    service.basePrice;

  const book = async () => {

    if (!address || !pincode) {
      alert("Fill all fields");
      return;
    }

    try {

      const userId =
        localStorage.getItem("userId");

      const res = await axios.post(
        `http://localhost:8080/customer/bookings?userId=${userId}`,
        {
          serviceId: service.id,
          durationMinutes: duration,
          address,
          pincode,
        }
      );

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

      <div className="duration-section">
        <p className="duration-title">
          Select Duration
        </p>

        <DurationSelector
          base={service.baseDuration}
          duration={duration}
          setDuration={setDuration}
        />
      </div>

      <p className="booking-price">
        Price: ₹{price}
      </p>

      <input
        className="booking-input"
        placeholder="Enter Address"
        value={address}
        onChange={(e) =>
          setAddress(e.target.value)
        }
      />

      <input
        className="booking-input"
        placeholder="Enter Pincode"
        value={pincode}
        onChange={(e) =>
          setPincode(e.target.value)
        }
      />

      <button
        className="confirm-booking-btn"
        onClick={book}
      >
        Confirm Booking
      </button>

    </div>
  );
}