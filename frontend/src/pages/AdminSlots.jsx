

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function AdminSlotManagement() {
  const { templeId } = useParams(); 
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [slotForm, setSlotForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    capacity: 1,
    price: 0,
    isActive: true,
  });

  const [editingSlotId, setEditingSlotId] = useState(null);

 
  const fetchData = async () => {
    setLoading(true);
    try {
      
      const templeRes = await API.get(`/temples/${templeId}`);
      setTemple(templeRes.data.data);

      const slotRes = await API.get(`/slots/temple/${templeId}`);
      setSlots(slotRes.data.slots || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch temple or slots");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [templeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSlotForm({
      ...slotForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        date: slotForm.date ? new Date(slotForm.date) : undefined,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        capacity: Number(slotForm.capacity),
        price: Number(slotForm.price),
        isActive: slotForm.isActive,
      };

      if (editingSlotId) {
        // UPDATE
        await API.put(`/slots/${editingSlotId}`, payload);
        alert("Slot updated successfully");
      } else {
        // CREATE
        await API.post("/slots", { templeId, ...payload });
        alert("Slot created successfully");
      }

      // Reset form
      setSlotForm({
        date: "",
        startTime: "",
        endTime: "",
        capacity: 1,
        price: 0,
        isActive: true,
      });
      setEditingSlotId(null);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save slot");
    }
  };

  const handleEdit = (slot) => {
    setSlotForm({
      date: slot.date.split("T")[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      price: slot.price,
      isActive: slot.isActive,
    });
    setEditingSlotId(slot._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 
  const handleDelete = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await API.delete(`/slots/${slotId}`);
      alert("Slot deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>
            {editingSlotId ? "Update Slot" : `Manage Slots for ${temple?.name}`}
          </h3>
          <Link className="btn btn-secondary" to="/admin/temples">
            Back to Temples
          </Link>
        </div>

        {/* Slot Form */}
        <form className="row g-2 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-2">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={slotForm.date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={slotForm.startTime}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">End Time</label>
            <input
              type="time"
              name="endTime"
              value={slotForm.endTime}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={slotForm.capacity}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              name="price"
              min="0"
              value={slotForm.price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                name="isActive"
                checked={slotForm.isActive}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label">Active</label>
            </div>
          </div>
          <div className="col-12 mt-2">
            <button type="submit" className="btn btn-primary w-100">
              {editingSlotId ? "Update Slot" : "Create Slot"}
            </button>
          </div>
        </form>

        {/* Slots Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Capacity</th>
                <th>Available Seats</th>
                <th>Price</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <tr key={slot._id}>
                    <td>{new Date(slot.date).toLocaleDateString()}</td>
                    <td>{slot.startTime} - {slot.endTime}</td>
                    <td>{slot.capacity}</td>
                    <td>{slot.availableSeats}</td>
                    <td>₹{slot.price}</td>
                    <td>{slot.isActive ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(slot)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(slot._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No slots created for this temple yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminSlotManagement;