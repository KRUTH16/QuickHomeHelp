
import { useEffect, useState } from "react";
import axios from "axios";
import './ViewServices.css';

interface Service {
  id: number;
  name: string;
  category: string;
  baseDuration: number;
  basePrice: number;
}

export default function ViewServices() {

  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const fetchServices = async () => {
    const res = await axios.get(
      "http://localhost:8080/admin/services"
    );
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);



  const deleteService = async (id: number) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this service?"
  );

  if (!confirmDelete) return;

  await axios.delete(
    `http://localhost:8080/admin/services/${id}`
  );

  fetchServices();
};

  const saveEdit = async () => {
    if (!editingService) return;

    await axios.put(
      `http://localhost:8080/admin/services/${editingService.id}`,
      editingService
    );

    setEditingService(null);
    fetchServices();
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
              <button
                onClick={() => setEditingService(service)}
              >
                Edit
              </button>

              <button
                onClick={() => deleteService(service.id)}
              >
                Delete
              </button>
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
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  name: e.target.value
                })
              }
            />

            <input
              value={editingService.category}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  category: e.target.value
                })
              }
            />

            <input
              type="number"
              value={editingService.baseDuration}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  baseDuration: Number(e.target.value)
                })
              }
            />

            <input
              type="number"
              value={editingService.basePrice}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  basePrice: Number(e.target.value)
                })
              }
            />

            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditingService(null)}>
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}