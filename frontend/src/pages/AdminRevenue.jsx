

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminRevenue() {
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    API.get("/admin/temple-revenue")
      .then((res) => setRevenue(res.data.revenue))
      .catch((err) => alert("Failed to fetch revenue"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>Temple Revenue</h3>
          <Link className="btn btn-secondary" to="/admin/dashboard">Go to Dashboard</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Temple</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((r) => (
                <tr key={r.templeId}>
                  <td>{r.templeName}</td>
                  <td>₹{r.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}