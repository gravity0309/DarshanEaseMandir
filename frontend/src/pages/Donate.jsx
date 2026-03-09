

import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function Donate() {
  const { user } = useContext(AuthContext);

  const [temples, setTemples] = useState([]);
  const [templeId, setTempleId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await API.get("/temples");
        setTemples(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch temples");
      }
    };

    fetchTemples();
  }, []);

  const donate = async (e) => {
    e.preventDefault();

    if (!templeId) {
      alert("Please select a temple");
      return;
    }

    if (amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/donations", {
        templeId,
        amount,
      });

      setDonationData(res.data.donation);
      setDonationSuccess(true);

      setTempleId("");
      setAmount("");

    } catch (err) {
      console.error(err);
      alert("Donation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    try {
      const response = await API.get(
        `/donations/${donationData._id}/receipt`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `donation-receipt-${donationData.receiptNumber}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      alert("Failed to download receipt");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <h3 className="mb-4 text-center">Donate to Temple</h3>

        {!user ? (
          <p className="text-danger text-center">
            Please login to donate.
          </p>
        ) : (
          <>
            <form onSubmit={donate}>

              <div className="mb-3">
                <label className="form-label">Select Temple</label>

                <select
                  className="form-select"
                  value={templeId}
                  onChange={(e) => setTempleId(e.target.value)}
                  required
                >
                  <option value="">-- Select Temple --</option>

                  {temples.map((temple) => (
                    <option key={temple._id} value={temple._id}>
                      {temple.name} ({temple.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Amount</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter donation amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                  required
                />
              </div>

              <button
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Processing..." : "Donate Now"}
              </button>
            </form>

            {/* Receipt Section */}

            {donationSuccess && donationData && (
              <div className="alert alert-success mt-4 text-center">

                <h5>Donation Successful 🙏</h5>

                <p>
                  Receipt No: <b>{donationData.receiptNumber}</b>
                </p>

                <button
                  className="btn btn-primary"
                  onClick={downloadReceipt}
                >
                  Download Receipt
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Donate;