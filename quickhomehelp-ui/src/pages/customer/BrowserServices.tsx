import { useEffect, useState, useMemo } from "react";
import ServiceCard from "./ServiceCard";
import "./BrowserServices.css";
import { getCustomerServices } from "../../api/customerApi";
import type { Service } from "../../types/serviceTypes";

export default function BrowseServices() {
  
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      const res = await getCustomerServices();
      setServices(res.data);
    };

    fetchServices();
  }, []);


  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, services]);

  return (
    <div className="browse-services-page">
      <input
        className="service-search"
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="services-container">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <p className="no-services">No services found</p>
        )}
      </div>
    </div>
  );
}
