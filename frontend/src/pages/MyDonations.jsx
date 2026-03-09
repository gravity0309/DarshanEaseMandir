import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await API.get("/donations/my-donations");
        setDonations(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h3 className="mb-4 text-center">My Donations</h3>

        {loading && <p className="text-center">Loading...</p>}

        {!loading && donations.length === 0 && (
          <p className="text-center">No donations found</p>
        )}

        {donations.length > 0 && (
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Temple</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.temple?.name}</td>
                  <td>{donation.temple?.location}</td>
                  <td>₹{donation.amount}</td>
                  <td>
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge bg-success">
                      {donation.receiptNumber}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}


export default MyDonations;