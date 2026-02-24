import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const login = async () => {
    setError(""); // clear previous error

    try {
      const res = await api.post("/auth/login", form);

      const { userId, role } = res.data;

      localStorage.setItem("userId", userId);

      localStorage.setItem("role", role);

      if (role === "ADMIN") navigate("/admin");

      if (role === "EXPERT") navigate("/expert");

      if (role === "CUSTOMER") navigate("/customer");
    } 
    catch (err: any) {
      
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="brand-title">QuickHomeHelp</h1>

        <h2 className="login-title">Welcome back</h2>

        <input
          className="login-input"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="login-input"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        {error && <p className="error-text">{error}</p>}

        <button className="login-button" onClick={login}>
          Login
        </button>

        <p className="register-text">
          New user?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
