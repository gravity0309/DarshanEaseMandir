

import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

function Landing() {
  const [temples, setTemples] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchTemples = async () => {
      try {
        const res = await API.get("/temples");
        setTemples(res.data?.data || []);
      } catch (err) {
        console.log("Error fetching temples:", err);
      }
    };

    fetchTemples();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      navigate("/temples");
      return;
    }
    navigate(`/temples?search=${search}`);
  };

  return (
    <>
      <Navbar />

      {/* RUNNING SHLOKA */}
      <div className="shaloka-bar">
        <marquee>
          ॐ नमः शिवाय | कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |
          लोकाः समस्ताः सुखिनो भवन्तु | श्री राम जय राम जय जय राम |
          ॐ नमो भगवते वासुदेवाय
        </marquee>
      </div>

      {/* HERO SECTION */}
      <div className="hero-section">

        {/* falling flowers */}
        <div className="petals"></div>

        {/* diya glow */}
        <div className="diya"></div>

        <div className="container text-center hero-content">
          <h1 className="display-3 fw-bold divine-title">
            Temple Darshan Booking
          </h1>

          <p className="lead">
            Book darshan slots and donate to temples easily
          </p>

          <form
            onSubmit={handleSearch}
            className="d-flex justify-content-center mt-4 flex-wrap"
          >
            <input
              className="form-control w-50 me-2 mb-2 shadow"
              placeholder="Search temples or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="btn btn-warning mb-2 shadow">
              Search
            </button>
          </form>

          {user?.role === "ADMIN" && (
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/admin/dashboard")}
            >
              Admin Dashboard
            </button>
          )}
        </div>
      </div>

      {/* POPULAR TEMPLES */}
      <div className="container mt-5">

        <h2 className="text-center fw-bold mb-4">
          Popular Temples
        </h2>

        <div className="row">
          {temples.slice(0, 6).map((temple) => (
            <div
              className="col-md-4 mb-4"
              key={temple._id}
              data-aos="zoom-in"
            >
              <div
                className="card temple-card h-100"
                onClick={() => navigate(`/temples/${temple._id}`)}
              >
                <img
                  src={
                    temple.image?.url ||
                    "https://images.unsplash.com/photo-1609942072337-431c5c9b3a9f"
                  }
                  className="card-img-top"
                  alt={temple.name}
                />

                <div className="card-body">
                  <h5>{temple.name}</h5>
                  <p className="text-muted">
                    📍 {temple.location}
                  </p>

                  <p>
                    {temple.description
                      ? temple.description.slice(0, 80)
                      : "No description"}
                    ...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DONATION */}
      <div className="donation-section text-center">

        <h2>Support Temple Development</h2>

        <p>
          Donate and help maintain temples and religious heritage
        </p>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/donate")}
        >
          Donate Now
        </button>
      </div>

      {/* TEMPLE GALLERY */}
      <div className="container mt-5">

        <h2 className="text-center fw-bold mb-4">
          Famous Temples of India
        </h2>

        <div className="row">

          <div className="col-md-3">
            <img
              className="gallery-img"
              src="https://media.istockphoto.com/id/1174372687/photo/somnath-temple-facade-gujarat.jpg?s=612x612&w=0&k=20&c=CQ3GvCigMhrsHGdxagJuxDDVdN2S3m-TwvJ95-hy5lA="
            />
          </div>

          <div className="col-md-3">
            <img
              className="gallery-img"
              src="https://images.unsplash.com/photo-1597074866923-dc0589150358"
            />
          </div>

          <div className="col-md-3">
            <img
              className="gallery-img"
              src="https://images.unsplash.com/photo-1627894483216-2138af692e32"
            />
          </div>

          <div className="col-md-3">
            <img
              className="gallery-img"
              src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e"
            />
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="container text-center py-5">

        <h3>Ready to plan your temple visit?</h3>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/temples")}
        >
          Explore Temples
        </button>
      </div>

      {/* FOOTER */}
      <div className="footer text-center">
        © 2026 Temple Darshan Booking System
      </div>

      {/* STYLES */}
      <style>{`

      .shaloka-bar{
        background:linear-gradient(90deg,#ff7e00,#ffb347);
        color:white;
        font-weight:bold;
        padding:10px;
        font-size:18px;
      }

      .hero-section{
        height:550px;
        background-image:url("https://images.unsplash.com/photo-1599661046827-dacde6976549");
        background-size:cover;
        background-position:center;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
      }

      .hero-section::before{
        content:"";
        position:absolute;
        inset:0;
        background:rgba(0,0,0,0.65);
      }

      .hero-content{
        position:relative;
        z-index:2;
      }

      .divine-title{
        text-shadow:0 0 15px gold;
      }

      .temple-card{
        cursor:pointer;
        transition:all .35s ease;
        border:none;
        box-shadow:0 8px 25px rgba(0,0,0,0.15);
      }

      .temple-card:hover{
        transform:translateY(-10px) scale(1.03);
        box-shadow:0 18px 40px rgba(0,0,0,0.35);
      }

      .temple-card img{
        height:220px;
        object-fit:cover;
      }

      .donation-section{
        margin-top:60px;
        padding:70px;
        color:white;
        background:linear-gradient(135deg,#ff8008,#ffc837);
      }

      .gallery-img{
        width:100%;
        height:200px;
        object-fit:cover;
        border-radius:10px;
        margin-bottom:20px;
        transition:transform .4s;
      }

      .gallery-img:hover{
        transform:scale(1.05);
      }

      .footer{
        background:#111;
        color:white;
        padding:20px;
        margin-top:40px;
      }

      /* falling petals */

      .petals::before{
        content:"🌸 🌸 🌸 🌸 🌸";
        position:absolute;
        width:100%;
        animation:petals 10s linear infinite;
        font-size:28px;
      }

      @keyframes petals{
        0%{transform:translateY(-50px);}
        100%{transform:translateY(600px);}
      }

      /* diya glow */

      .diya{
        position:absolute;
        bottom:20px;
        right:40px;
        width:60px;
        height:60px;
        background:radial-gradient(circle,gold,orange,transparent);
        border-radius:50%;
        animation:glow 2s infinite alternate;
      }

      @keyframes glow{
        from{opacity:.5; transform:scale(.9);}
        to{opacity:1; transform:scale(1.2);}
      }

      `}</style>
    </>
  );
}

export default Landing;