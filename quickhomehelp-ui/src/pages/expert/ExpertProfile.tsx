

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import "./ExpertProfile.css";

interface Service {
  id: number;
  name: string;
  category: string;
}

interface User {
  id: number;
  name: string;
}

interface ExpertProfileType {
  user: User;
  services: Service[];
  pincode: string;
  address: string;
  trainingDone: boolean;
}

interface FormState {
  serviceIds: number[];
  pincode: string;
  address: string;
  trainingDone: boolean;
}

interface ExpertProfileProps {
  profile: ExpertProfileType;
  refresh: () => void;
}

export default function ExpertProfile({
  profile,
  refresh,
}: ExpertProfileProps) {

  const [allServices, setAllServices] =
    useState<Service[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("");

  const [form, setForm] =
    useState<FormState>({
      serviceIds: [],
      pincode: "",
      address: "",
      trainingDone: false,
    });

  useEffect(() => {
    axios
      .get<Service[]>("http://localhost:8080/admin/services")
      .then((res) => {
        setAllServices(res.data);
      });
  }, []);

  useEffect(() => {
    setForm({
      serviceIds: profile.services
        ? profile.services.map((s) => s.id)
        : [],
      pincode: profile.pincode || "",
      address: profile.address || "",
      trainingDone: profile.trainingDone || false,
    });
  }, [profile]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value, checked, type } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleServiceSelect =
    (serviceId: number) => {

      setForm((prev) => ({
        ...prev,
        serviceIds: prev.serviceIds.includes(
          serviceId
        )
          ? prev.serviceIds.filter(
              (id) => id !== serviceId
            )
          : [...prev.serviceIds, serviceId],
      }));
    };

  const updateProfile = async () => {

    await axios.patch(
      "http://localhost:8080/expert/profile/update",
      {
        userId: profile.user.id,
        ...form,
      }
    );

    alert("Profile updated");
    refresh();
  };

  const categories =
    Array.from(
      new Set(
        allServices.map(
          (s) => s.category
        )
      )
    );

  const filteredServices =
    allServices.filter(
      (s) =>
        s.category ===
        selectedCategory
    );

  return (
    <div id="expertProfileContainer">

      <h2 id="expertName">
        Welcome, {profile.user?.name}
      </h2>

      {profile.services &&
      profile.services.length > 0 &&
      profile.pincode &&
      profile.address &&
      profile.trainingDone ? (

        <div
          id="expertBioSection"
          className="profile-card"
        >
          <h3>Profile Bio</h3>

          <p>
            <b>Services:</b>{" "}
            {profile.services
              .map((s) => s.name)
              .join(", ")}
          </p>

          <p>
            <b>Pincode:</b>{" "}
            {profile.pincode}
          </p>

          <p>
            <b>Address:</b>{" "}
            {profile.address}
          </p>

          <p>
            <b>Training:</b>{" "}
            Completed
          </p>

          <p className="verification-text">
            Awaiting admin verification…
          </p>
        </div>

      ) : (

        <div
          id="profileFormSection"
          className="profile-card"
        >
          <h3>Complete Profile</h3>

          <select
            className="profile-input"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
          >
            <option value="">
              Select Category
            </option>

            {categories.map(
              (cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              )
            )}
          </select>

          {selectedCategory && (
            <div className="services-checkbox-group">
              {filteredServices.map(
                (service) => (
                  <label
                    key={service.id}
                  >
                    <input
                      type="checkbox"
                      checked={form.serviceIds.includes(
                        service.id
                      )}
                      onChange={() =>
                        handleServiceSelect(
                          service.id
                        )
                      }
                    />
                    {service.name}
                  </label>
                )
              )}
            </div>
          )}

          <input
            id="pincode"
            className="profile-input"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />

          <input
            id="address"
            className="profile-input"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <label className="checkbox-label">
            Training Done
            <input
              id="trainingDone"
              type="checkbox"
              checked={
                form.trainingDone
              }
              onChange={handleChange}
            />
          </label>

          <button
            id="updateProfileBtn"
            className="update-btn"
            onClick={updateProfile}
          >
            Update Profile
          </button>

        </div>
      )}

    </div>
  );
}