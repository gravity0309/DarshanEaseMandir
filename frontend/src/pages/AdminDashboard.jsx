

// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data.analytics);
      } catch (err) {
        console.error(err);
        alert("Access denied. Please login as admin.");
        navigate("/");
      }
    };
    fetchStats();
  }, [navigate]);

  if (!stats) return <p className="text-center mt-4">Loading...</p>;

  const actions = [
    { name: "Manage Temples", route: "/admin/temples" },
    { name: "Manage Users", route: "/admin/users" },
    { name: "View Donations", route: "/admin/donations" },
    { name: "Revenue", route: "/admin/revenue" },
    { name: "View Bookings", route: "/admin/bookings" },
  ];

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>Admin Dashboard</h3>
        <div className="row mt-4">
          {actions.map((action) => (
            <div className="col-md-3 mb-3" key={action.route}>
              <div
                className="card shadow p-3 text-center admin-card"
                onClick={() => navigate(action.route)}
                style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              >
                <h5>{action.name}</h5>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card shadow p-3 text-center admin-card">
              <h5>Total Users</h5>
              <h3>{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow p-3 text-center admin-card">
              <h5>Total Temples</h5>
              <h3>{stats.totalTemples}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow p-3 text-center admin-card">
              <h5>Total Bookings</h5>
              <h3>{stats.totalBookings}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow p-3 text-center admin-card">
              <h5>Total Revenue</h5>
              <h3>₹{stats.totalRevenue}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}