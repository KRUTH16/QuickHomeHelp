import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import "./ExpertProfile.css";
import {
  getServicesForExpertProfile,
  updateExpertProfile,
} from "../../api/expertApi";

import type {
  ExpertProfile,
  ExpertProfileFormState,
  ServiceOption,
} from "../../types/serviceTypes";

type ExpertProfileProps = {
  profile: ExpertProfile;
  refresh: () => Promise<void>;
};

export default function ExpertProfilePage({
  profile,
  refresh,
}: ExpertProfileProps) {
  const [allServices, setAllServices] = useState<ServiceOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [form, setForm] = useState<ExpertProfileFormState>({
    serviceIds: [],
    pincode: "",
    address: "",
  });

  const [pincodeError, setPincodeError] = useState<string>("");

  useEffect(() => {
    const fetchAllServices = async () => {
      const res = await getServicesForExpertProfile();
      setAllServices(res.data);
    };
    fetchAllServices();
  }, []);


  useEffect(() => {
    setForm({
      serviceIds: profile.services ? profile.services.map((s) => s.id) : [],
      pincode: profile.pincode || "",
      address: profile.address || "",
    });
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "pincode") {
      const isValid = /^[0-9]{6}$/.test(value);
      if (!isValid && value.length > 0) {
        setPincodeError("Enter a valid six digit pincode");
      } else {
        setPincodeError("");
      }
    }
  };

  const handleServiceSelect = (serviceId: number) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  const updateProfileData = async () => {
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      setPincodeError("Enter a valid six digit pincode");
      return;
    }
    await updateExpertProfile({
      userId: profile.user.id,
      serviceIds: form.serviceIds,
      pincode: form.pincode,
      address: form.address,
    });
    alert("Profile updated");
    refresh();
  };

  const categories = Array.from(new Set(allServices.map((s) => s.category)));
  const filteredServices = allServices.filter(
    (s) => s.category === selectedCategory,
  );

  return (
    <div id="expertProfileContainer">
      <h2 id="expertName">Welcome, {profile.user?.name}</h2>
      {profile.services &&
      profile.services.length > 0 &&
      profile.pincode &&
      profile.address ? (
        <div id="expertBioSection" className="profile-card">
          <h3>Profile Bio</h3>
          <p>
            <b>Services:</b> {profile.services.map((s) => s.name).join(", ")}
          </p>
          <p>
            <b>Pincode:</b> {profile.pincode}
          </p>
          <p>
            <b>Address:</b> {profile.address}
          </p>
          <p className="verification-text">
            {profile.trainingDone
              ? "Your profile is under admin review for final approval."
              : "Access to the service provider panel will be granted after admin verification."}
          </p>
        </div>
      ) : (
        <div id="profileFormSection" className="profile-card">
          <h3>Complete Profile</h3>
          <select
            className="profile-input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="services-checkbox-group">
            {filteredServices.map((service) => (
              <label key={service.id} className="service-item">
                <input
                  type="checkbox"
                  checked={form.serviceIds.includes(service.id)}
                  onChange={() => handleServiceSelect(service.id)}
                />
                <span>{service.name}</span>
              </label>
            ))}
          </div>
          
          <input
            id="pincode"
            className="profile-input"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />
          {pincodeError && <p className="pincode-error">{pincodeError}</p>}
          <input
            id="address"
            className="profile-input"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
          <button
            id="updateProfileBtn"
            className="update-btn"
            onClick={updateProfileData}
          >
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
}
