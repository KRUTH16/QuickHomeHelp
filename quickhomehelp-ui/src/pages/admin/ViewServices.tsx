import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ViewServices.css";
import {
  deleteAdminService,
  getAdminServices,
  updateAdminService,
} from "../../api/adminApi";

import type { Service } from "../../types/serviceTypes";

export default function ViewServices() {

  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const handledDeletePathRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams();

  const fetchServices = async () => {
    const res = await getAdminServices();
    setServices(res.data);
  };
  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (isSavingEdit) {
      return;
    }
    if (!serviceId) {
      return;
    }

    const id = Number(serviceId);
    if (Number.isNaN(id) || services.length === 0) {
      return;
    }
    if (location.pathname.includes("/edit/")) {
      const selectedService = services.find((service) => service.id === id) ?? null;
      setEditingService(selectedService);
    }

  }, [serviceId, services, location.pathname, isSavingEdit]);

  useEffect(() => {
    const isDeletePath = location.pathname.includes("/delete/");
    if (!isDeletePath) {
      handledDeletePathRef.current = null;
      return;
    }

    if (!serviceId || services.length === 0) {
      return;
    }

    if (handledDeletePathRef.current === location.pathname) {
      return;
    }

    const id = Number(serviceId);
    if (Number.isNaN(id)) {
      navigate("/admin/services", { replace: true });
      return;
    }

    handledDeletePathRef.current = location.pathname;

    const runDelete = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this service?");
      if (!confirmDelete) {
        navigate("/admin/services", { replace: true });
        return;
      }
      await deleteAdminService(id);
      await fetchServices();
      navigate("/admin/services", { replace: true });
    };

    runDelete();
  }, [serviceId, services, location.pathname]);



  const saveEdit = async () => {
    if (!editingService || isSavingEdit) {
      return;
    }

    setIsSavingEdit(true);
    try {
      await updateAdminService(editingService.id, editingService);
      setEditingService(null);
      navigate("/admin/services", { replace: true });
      await fetchServices();
    } finally {
      setIsSavingEdit(false);
    }
  };
  const cancelEdit = () => {
    setEditingService(null);
    navigate("/admin/services", { replace: true });
  };
  
  return (
    <div className="view-services-container">
      <h2>Manage Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>Category: {service.category}</p>
            <p>Base Duration: {service.baseDuration} mins</p>
            <p>Base Price: ₹{service.basePrice}</p>
            <div className="card-buttons">
              <button onClick={() => navigate(`/admin/services/edit/${service.id}`)}>Edit</button>
              <button onClick={() => navigate(`/admin/services/delete/${service.id}`)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editingService && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Service</h3>
            <input
              value={editingService.name}
              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
            />
            <input
              value={editingService.category}
              onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
            />
            <input
              type="number"
              value={editingService.baseDuration}
              onChange={(e) =>
                setEditingService({ ...editingService, baseDuration: Number(e.target.value) })
              }
            />
            <input
              type="number"
              value={editingService.basePrice}
              onChange={(e) =>
                setEditingService({ ...editingService, basePrice: Number(e.target.value) })
              }
            />
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
