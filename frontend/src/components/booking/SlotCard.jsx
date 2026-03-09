import { Link } from "react-router-dom";

function SlotCard({slot}){

  return(

    <div className="col-md-4 mb-3">

      <div className="card p-3">

        <h5>{slot.date}</h5>

        <p>Time: {slot.startTime} - {slot.endTime}</p>

        <p>Price: ₹{slot.price}</p>

        <p>Available: {slot.capacity}</p>

        <Link
          to={`/booking/${slot._id}`}
          className="btn btn-warning"
        >
          Book Now
        </Link>

      </div>

    </div>
  );
}

export default SlotCard;