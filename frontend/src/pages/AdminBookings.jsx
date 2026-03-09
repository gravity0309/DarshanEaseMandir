
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/admin/bookings");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>All Bookings</h3>
          <Link className="btn btn-secondary" to="/admin/dashboard">
            Go to Dashboard
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Temple</th>
                <th>Slot</th>
                <th>Persons</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.user?.name || "N/A"}</td>

                    <td>{b.temple?.name || "N/A"}</td>

                    <td>
                      {b.slot
                        ? `${b.slot.startTime} - ${b.slot.endTime}`
                        : "Slot not available"}
                    </td>

                    <td>{b.persons}</td>

                    <td>₹{b.amount}</td>

                    <td>
                      <span className="badge bg-info">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}