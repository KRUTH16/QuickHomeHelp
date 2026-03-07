import { Outlet, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

type AdminDashboardProps = {
  homeOnly?: boolean;
};

export default function AdminDashboard({ homeOnly = false }: AdminDashboardProps) {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (homeOnly) {
    return (
      <>
        <h1 className="welcome-text">Welcome Admin</h1>
        <div className="admin-box-container">
          <div className="admin-box" onClick={() => navigate("/admin/services/add")}>
            Add Service
          </div>
          <div className="admin-box" onClick={() => navigate("/admin/services")}>
            View Services
          </div>
          <div className="admin-box" onClick={() => navigate("/admin/experts/verify")}>
            Verify Experts
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-topbar">
        <div className="admin-name">Admin</div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  );
}
