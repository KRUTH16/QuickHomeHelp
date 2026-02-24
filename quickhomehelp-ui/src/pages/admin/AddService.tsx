
import { useState } from "react";
import axios from "axios";
import './AddService.css';



interface ServiceForm {
  name: string;
  category: string;
  baseDuration: string;
  basePrice: string;
}

export default function AddService() {
  const [form, setForm] = useState<ServiceForm>({
    name: "",
    category: "",
    baseDuration: "",
    basePrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;

    setForm({
      ...form,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await axios.post(
        "http://localhost:8080/admin/services",
        {
          ...form,
          baseDuration: Number(form.baseDuration),
          basePrice: Number(form.basePrice),
        }
      );

      setSuccessMsg(
        "Service added successfully "
      );

      setForm({
        name: "",
        category: "",
        baseDuration: "",
        basePrice: "",
      });
    }

    catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    setErrorMsg(
      error.response?.data?.message ||
      "Failed to add service"
    );
  } else {
    setErrorMsg("Something went wrong");
  }
}

    finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="addServiceContainer"
      className="add-service-container"
    >
      <h2
        id="addServiceTitle"
        className="add-service-title"
      >
        Add Service 
      </h2>

      {successMsg && (
        <p
          id="successMessage"
          className="success-message"
        >
          {successMsg}
        </p>
      )}

      {errorMsg && (
        <p
          id="errorMessage"
          className="error-message"
        >
          {errorMsg}
        </p>
      )}

      <div
        id="serviceForm"
        className="service-form"
      >
       

        <input
          id="category"
          className="input-field"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          id="name"
          className="input-field"
          placeholder="Service Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          id="baseDuration"
          type="number"
          className="input-field no-spinner"
          placeholder="Base Duration (Minutes)"
          value={form.baseDuration}
          onChange={handleChange}
        />

        <input
          id="basePrice"
          type="number"
          className="input-field no-spinner"
          placeholder="Base Price"
          value={form.basePrice}
          onChange={handleChange}
        />

        <button
          id="addServiceBtn"
          className="add-service-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Adding..."
            : "Add Service"}
        </button>
      </div>
    </div>
  );
}
