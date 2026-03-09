import { Link } from "react-router-dom";

function TempleCard({ temple }) {

  return (

    <div className="col-md-4 mb-4">

      <div className="card h-100 shadow-sm">

        <img
          src={temple.image}
          className="card-img-top"
          alt={temple.name}
          style={{ height: "220px", objectFit: "cover" }}
        />

        <div className="card-body">

          <h5 className="card-title">
            {temple.name}
          </h5>

          <p className="card-text text-muted">
            📍 {temple.location}
          </p>

          <p className="card-text">
            {temple.description?.slice(0, 80)}...
          </p>

          <Link
            to={`/temple/${temple._id}`}
            className="btn btn-warning"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>

  );

}

export default TempleCard;