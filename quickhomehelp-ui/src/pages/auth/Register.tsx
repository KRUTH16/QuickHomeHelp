
import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios"; 

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER"
  });

  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const register = async () => {

    setError("");

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must contain uppercase, lowercase, digit and special character and be at least 8 characters long"
      );
      return;
    }

    try {

      await api.post("/auth/register", form);

      alert("Registered successfully");
      navigate("/login");

    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {

        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed.Enter Valid Credentials.");
        }

      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1 className="brand-title">
          QuickHomeHelp
        </h1>

        <h2 className="register-title">
          Create your account
        </h2>

        <input
          className="register-input"
          placeholder="Name"
          value={form.name}
          onChange={e =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
          className="register-input"
          placeholder="Email"
          value={form.email}
          onChange={e =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          className="register-input"
          placeholder="Password"
          value={form.password}
          onChange={e =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <select
          className="register-select"
          value={form.role}
          onChange={e =>
            setForm({
              ...form,
              role: e.target.value
            })
          }
        >
          <option value="CUSTOMER">
            Customer
          </option>
          <option value="EXPERT">
            Expert
          </option>
        </select>

        <button
          className="register-button"
          onClick={register}
        >
          Register
        </button>

      </div>

    </div>
  );
}
