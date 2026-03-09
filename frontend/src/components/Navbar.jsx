
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🛕 Temple Booking
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/temples">Temples</Link>
            </li>

            {user ? (
              <li className="nav-item dropdown ms-3">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <div
                    className="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center me-2"
                    style={{ width: "35px", height: "35px", fontWeight: "bold" }}
                  >
                    {firstLetter}
                  </div>
                  <span>{user.name}</span>
                </a>

                <ul className="dropdown-menu dropdown-menu-end">

                  {user.role === "ADMIN" && (
                    <li>
                      <Link className="dropdown-item" to="/admin/dashboard">
                        Admin Dashboard
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link className="dropdown-item" to="/my-bookings">
                      My Bookings
                    </Link>
                  </li>

                  {/* ✅ NEW: My Donations */}
                  <li>
                    <Link className="dropdown-item" to="/my-donations">
                      My Donations
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>

                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>

                <li className="nav-item">
                  <Link className="btn btn-warning ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;