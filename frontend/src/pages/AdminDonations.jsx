import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    API.get("/admin/donations")
      .then((res) => setDonations(res.data.donations))
      .catch((err) => alert("Failed to fetch donations"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>All Donations</h3>
          <Link className="btn btn-secondary" to="/admin/dashboard">Go to Dashboard</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Donor Name</th>
                <th>Temple</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id}>
                  <td>{d.user?.name || "Unknown"}</td>
                  <td>{d.temple?.name || "N/A"}</td>
                  <td>₹{d.amount}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}