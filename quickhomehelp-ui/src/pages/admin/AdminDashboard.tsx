
import { useState } from "react";
import "./AdminDashboard.css";

import AddService from "./AddService";
import VerifyExperts from "./VerifyExperts";
import ViewServices from "./ViewServices";




export default function AdminDashboard() {

  const [page, setPage] =
    useState("welcome");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (

    <div className="admin-container">

      {/* 🔝 TOP BAR */}
      <div className="admin-topbar">

        <div className="admin-name">
          👤 Admin
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/*  MAIN BODY */}
      <div className="admin-body">

        {/*  BOX NAVIGATION */}
        {page === "welcome" && (

          <>

            <h1 className="welcome-text">
              Welcome Admin
            </h1>

            <div className="admin-box-container">

              <div
                className="admin-box"
                onClick={() => setPage("add")}
              >
                Add Service
              </div>

              <div
  className="admin-box"
  onClick={() =>
    setPage("services")
  }
>
  View Services
</div>


              <div
                className="admin-box"
                onClick={() => setPage("verify")}
              >
                Verify Experts
              </div>


            </div>

          </>

        )}

        {/*  PAGE LOAD AREA */}

        {page === "add" && (
          <div>
            <button
              className="back-btn"
              onClick={() =>
                setPage("welcome")
              }
            >
              ← Back
            </button>
            <AddService />
          </div>
        )}

        {page === "services" && (
                    <div>
            <button
              className="back-btn"
              onClick={() =>
                setPage("welcome")
              }
            >
              ← Back
            </button>
           <ViewServices />
          </div>

  
)}


        {page === "verify" && (
          <div>
            <button
              className="back-btn"
              onClick={() =>
                setPage("welcome")
              }
            >
              ← Back
            </button>
            <VerifyExperts />
          </div>
        )}

   

      </div>

    </div>
  );
}


