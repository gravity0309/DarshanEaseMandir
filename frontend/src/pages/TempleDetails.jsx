

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function TempleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch temple info and slots
  useEffect(() => {
    const fetchData = async () => {
      try {
        const templeRes = await API.get(`/temples/${id}`);
        setTemple(templeRes.data.data);

        const slotRes = await API.get(`/slots/temple/${id}`);
         setSlots(slotRes.data.slots || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Handle booking
  const handleBooking = (slotId) => {
    navigate(`/booking/${slotId}`);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* Temple Banner */}
        <img
          src={temple?.image?.url || "https://via.placeholder.com/1200x400"}
          className="img-fluid rounded shadow mb-4"
          style={{ height: "420px", width: "100%", objectFit: "cover" }}
        />

        <div className="row">
          {/* LEFT SIDE */}
          <div className="col-md-8">
            <h2>{temple.name}</h2>
            <p className="text-muted">📍 {temple.location}</p>

            <hr />
            <h4>About Temple</h4>
            <p>{temple.description}</p>

            <hr />
            <h4>Available Darshan Slots</h4>

            {slots.length === 0 && (
              <p className="text-muted">No slots created by organizer yet</p>
            )}

            <div className="row">
              {slots.map((slot) => (
                <div className="col-md-6 mt-3" key={slot._id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h6>
                        {slot.startTime} - {slot.endTime}
                      </h6>
                      <p>Date: {new Date(slot.date).toLocaleDateString()}</p>
                      <p>Available Seats: {slot.availableSeats}</p>
                      <p>Price: ₹{slot.price}</p>

                      <button
                        className="btn btn-warning w-100"
                        onClick={() => handleBooking(slot._id)}
                      >
                        Book Darshan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h5>Temple Information</h5>
                <hr />
                <p>
                  <b>Name:</b> {temple.name}
                </p>
                <p>
                  <b>Location:</b> {temple.location}
                </p>
                <p className="text-muted">
                  Slots are created by temple organizers. Please select a slot
                  to book darshan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TempleDetails;