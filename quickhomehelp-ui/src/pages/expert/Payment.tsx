import { useState } from "react";
import "./Payment.css";
import { collectBookingPayment } from "../../api/expertApi";
import type { PaymentProps } from "../../types/bookingTypes";

export default function PaymentComponent({
  bookingId,
  amount,
  refresh,
}: PaymentProps) {
  
  const [method, setMethod] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(false);

  const collectPayment = async (selectedMethod: string) => {
    try {
      setProcessing(true);
      await collectBookingPayment(bookingId, selectedMethod);
      setPaid(true);
      refresh();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-box">
      <h4>Payment</h4>
      <p className="payment-amount">
        Amount to Collect: <b>₹{amount}</b>
      </p>
      {!method && (
        <>
          <button onClick={() => setMethod("CASH")}>Cash</button>
          <button onClick={() => setMethod("UPI")}>UPI</button>
        </>
      )}
      {method === "UPI" && !paid && (
        <div className="qr-box">
          <img src="/dummy-qr.png" alt="UPI QR" width="150" />
          {processing ? (
            <p className="processing-text">Processing payment...</p>
          ) : (
            <button
              className="confirm-btn"
              onClick={() => collectPayment("UPI")}
            >
              Confirm UPI Payment
            </button>
          )}
        </div>
      )}
      {method === "CASH" && !paid && (
        <button
          className="confirm-btn"
          onClick={() => collectPayment("CASH")}
          disabled={processing}
        >
          Confirm Cash Payment
        </button>
      )}
      {paid && <p className="success-text">Payment Collected</p>}
    </div>
  );
}
