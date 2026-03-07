import { useState } from "react";
import BookingForm from "./BookingForm";
import "./ServiceCard.css";
import type { Service } from "../../types/serviceTypes";

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="service-card">
        <h3>{service.name}</h3>
        <p>Category: {service.category}</p>
        <p>Base Duration: {service.baseDuration} mins</p>
        <p>Base Price: ₹{service.basePrice}</p>
        <p className="extra-note">
          Additional charges may apply for extra time
        </p>
        <button className="book-btn" onClick={openModal}>
          Book Service
        </button>
      </div>

      {open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="booking-modal"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <span className="booking-close-btn" onClick={closeModal}>
              x
            </span>
            <h2>{service.name}</h2>
            <BookingForm service={service} close={closeModal} />
          </div>
        </div>
      )}
    </>
  );
}
