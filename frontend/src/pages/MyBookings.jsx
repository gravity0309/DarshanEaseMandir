

import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await API.get("/bookings/my-bookings");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await API.put(`/bookings/${bookingId}/cancel`);

      alert("Booking cancelled successfully");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <p>Loading your bookings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h3 className="mb-4">My Bookings</h3>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Temple</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const slot = booking.slot;
                  const temple = booking.temple;

                  const date = slot
                    ? new Date(slot.date).toLocaleDateString()
                    : "N/A";

                  const time = slot
                    ? `${slot.startTime} - ${slot.endTime}`
                    : "N/A";

                  const amount = slot ? `₹${slot.price}` : "N/A";

                  return (
                    <tr key={booking._id}>
                      <td>{temple?.name || "Temple"}</td>
                      <td>{date}</td>
                      <td>{time}</td>
                      <td>{amount}</td>

                      <td>
                        {booking.status === "CANCELLED" ? (
                          <span className="badge bg-secondary">
                            Cancelled
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            Confirmed
                          </span>
                        )}
                      </td>

                      <td>
                        {booking.status !== "CANCELLED" ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(booking._id)}
                          >
                            Cancel
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default MyBookings;