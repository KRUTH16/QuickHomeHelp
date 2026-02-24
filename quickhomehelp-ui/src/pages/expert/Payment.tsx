
import { useState, useEffect } from "react";
import axios from "axios";
import "./Payment.css";

interface PaymentProps {
  bookingId: number;
  refresh: () => void;
}

export default function PaymentComponent({
  bookingId,
  refresh,
}: PaymentProps) {

  const [method, setMethod] =
    useState<string>("");

  const [processing, setProcessing] =
    useState<boolean>(false);

  const [paid, setPaid] =
    useState<boolean>(false);

      const collectPayment = async (selectedMethod: string) => {

    await axios.post(
      "http://localhost:8080/payments/collect",
      null,
      {
        params: {
          bookingId,
          method: selectedMethod,
        },
      }
    );
  };

  useEffect(() => {

    if (method === "UPI") {

      setProcessing(true);

      const timer = setTimeout(async () => {

        await collectPayment("UPI");

        setProcessing(false);
        setPaid(true);

        refresh();

      }, 4000); 

      return () => clearTimeout(timer);
    }

  }, [method]);



  const handleCash = async () => {

    await collectPayment("CASH");
    setPaid(true);
    refresh();
  };

  return (

    <div className="payment-box">

      <h4>Payment</h4>

      {!method && (
        <>
          <button onClick={() => setMethod("CASH")}>
             Cash
          </button>

          <button onClick={() => setMethod("UPI")}>
             UPI
          </button>
        </>
      )}

      {method === "UPI" && !paid && (

        <div className="qr-box">

          <img
            src="/dummy-qr.png"
            alt="UPI QR"
            width="150"
          />

          {processing && (
            <p className="processing-text">
              Waiting for payment confirmation...
            </p>
          )}

        </div>
      )}

      {method === "CASH" && !paid && (

        <button
          className="confirm-btn"
          onClick={handleCash}
        >
          Confirm Cash Payment
        </button>
      )}

      {paid && (
        <p className="success-text">
           Payment Collected
        </p>
      )}

    </div>
  );
}