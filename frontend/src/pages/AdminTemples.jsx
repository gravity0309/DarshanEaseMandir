

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminTemples() {
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [newTemple, setNewTemple] = useState({
    name: "",
    location: "",
    description: "",
    image: null,
  });
  const [editingTemple, setEditingTemple] = useState(null);

  const fetchTemples = async () => {
    try {
      const res = await API.get("/temples");
      setTemples(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch temples.");
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingTemple) {

      // UPDATE TEMPLE
      if (newTemple.image) {
        // If new image selected → send formData
        const formData = new FormData();
        formData.append("name", newTemple.name);
        formData.append("location", newTemple.location);
        formData.append("description", newTemple.description);
        formData.append("image", newTemple.image);

        await API.put(`/temples/${editingTemple._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      } else {
        // If image not changed → send JSON
        await API.put(`/temples/${editingTemple._id}`, {
          name: newTemple.name,
          location: newTemple.location,
          description: newTemple.description,
        });
      }

      alert("Temple updated successfully!");

    } else {

      // CREATE TEMPLE
      const formData = new FormData();
      formData.append("name", newTemple.name);
      formData.append("location", newTemple.location);
      formData.append("description", newTemple.description);
      formData.append("image", newTemple.image);

      await API.post("/temples", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Temple created successfully!");
    }

    setNewTemple({
      name: "",
      location: "",
      description: "",
      image: null,
    });

    setEditingTemple(null);
    fetchTemples();

  } catch (err) {
    console.error(err);
    alert("Failed to create/update temple.");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this temple?")) return;
    try {
      await API.delete(`/temples/${id}`);
      fetchTemples();
    } catch (err) {
      console.error(err);
      alert("Failed to delete temple.");
    }
  };

  const handleEdit = (temple) => {
    setEditingTemple(temple);
    setNewTemple({
      name: temple.name,
      location: temple.location,
      description: temple.description,
      image: null, // Reset file input
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleManageSlots = (templeId) => {
    navigate(`/admin/slots/${templeId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>{editingTemple ? "Update Temple" : "Create Temple"}</h3>
          <Link className="btn btn-secondary" to="/admin/dashboard">
            Go to Dashboard
          </Link>
        </div>

        {/* Create/Edit Temple Form */}
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Temple Name"
                value={newTemple.name}
                onChange={(e) =>
                  setNewTemple({ ...newTemple, name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={newTemple.location}
                onChange={(e) =>
                  setNewTemple({ ...newTemple, location: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setNewTemple({ ...newTemple, image: e.target.files[0] })
                }
                required={!editingTemple}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={newTemple.description}
                onChange={(e) =>
                  setNewTemple({ ...newTemple, description: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className={`btn ${editingTemple ? "btn-success" : "btn-primary"}`}
            >
              {editingTemple ? "Update Temple" : "Create Temple"}
            </button>
            {editingTemple && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingTemple(null);
                  setNewTemple({ name: "", location: "", description: "", image: null });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Temples Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {temples.map((t) => (
                <tr key={t._id}>
                  <td>
                    {t.image?.url ? (
                      <img
                        src={t.image.url}
                        alt={t.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{t.name}</td>
                  <td>{t.location}</td>
                  <td>{t.description}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleManageSlots(t._id)}
                    >
                      Manage Slots
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {temples.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No temples found.
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