
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import "./BrowserServices.css";

interface Service {
  id: number;
  name: string;
  category: string;
  baseDuration: number;
  basePrice: number;
}

export default function BrowseServices() {

  const [services, setServices] =
    useState<Service[]>([]);

  const [search, setSearch] =
    useState<string>("");

  
    sessionStorage.getItem("userId");

  useEffect(() => {

    const fetchServices = async () => {

      const res = await axios.get<Service[]>(
        "http://localhost:8080/customer/services"
      );

      setServices(res.data);
    };

    fetchServices();

  }, []);

  const filteredServices = useMemo(() => {

    return services.filter((service) =>
      service.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      service.category
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, services]);

  return (

    <div className="browse-services-page">

      <input
        className="service-search"
        placeholder="Search services..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="services-container">

        {filteredServices.length > 0 ? (

          filteredServices.map((service) => (

            <ServiceCard
              key={service.id}
              service={service}
            />

          ))

        ) : (

          <p className="no-services">
            No services found
          </p>

        )}

      </div>

    </div>
  );
}