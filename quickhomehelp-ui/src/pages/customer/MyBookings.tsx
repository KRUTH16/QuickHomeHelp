

import { useEffect, useState } from "react";
import axios from "axios";
import "./MyBookings.css";

interface Booking {
  id: number;
  status: string;
  address: string;
  pincode: string;
  amount: number;
  otp?: string;
  paymentStatus: string;
  rated: boolean;
}

export default function MyBookings() {

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [rating, setRating] =
    useState<number>(5);

  const [comment, setComment] =
    useState<string>("");

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {

    const fetchBookings = async () => {

      if (!userId) return;

      const res = await axios.get<Booking[]>(
        `http://localhost:8080/customer/bookings?customerId=${userId}`
      );

      setBookings(res.data);
    };

    fetchBookings();

  }, [userId]);

  if (bookings.length === 0)
    return (
      <p className="no-bookings">
        No bookings yet
      </p>
    );


  const submitRating = async (
    bookingId: number
  ) => {

    await axios.post(
      "http://localhost:8080/ratings",
      {
        bookingId,
        stars: rating,
        comment,
      }
    );

    alert("Rating submitted");

    const res = await axios.get<Booking[]>(
      `http://localhost:8080/customer/bookings?customerId=${userId}`
    );

    setBookings(res.data);

    setRating(5);
    setComment("");
  };


  return (

    <div className="bookings-container">

      <h2>My Bookings</h2>

      <div className="bookings-grid">

        {bookings.map((b) => (

          <div
            key={b.id}
            className="booking-card"
          >

            <p>
              <b>Booking ID:</b> {b.id}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span
                className={`status ${b.status.toLowerCase()}`}
              >
                {b.status}
              </span>
            </p>

            <p>
              <b>Address:</b> {b.address}
            </p>

            <p>
              <b>Pincode:</b> {b.pincode}
            </p>

            {b.status === "ACCEPTED" &&
              b.otp && (

              <div className="otp-box">
                <p>Service OTP</p>
                <h1>{b.otp}</h1>
                <span>
                  Share with expert to start service
                </span>
              </div>
            )}

            {b.paymentStatus === "PAID" && (
              <span className="paid-badge">
                 Paid
              </span>
            )}

            {b.status === "COMPLETED" &&
              b.paymentStatus === "PAID" &&
              !b.rated && (

              <div className="rating-box">

                <p>Rate Service</p>

                <select
                  value={rating}
                  onChange={(e) =>
                    setRating(Number(e.target.value))
                  }
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <textarea
                  value={comment}
                  placeholder="Comment"
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                />

                <button
                  onClick={() =>
                    submitRating(b.id)
                  }
                >
                  Submit Rating
                </button>

              </div>
            )}

            {b.rated && (
              <div className="rated-message">
                 Thanks for your feedback!
              </div>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}