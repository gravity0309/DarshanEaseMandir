import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Booking(){

  const {slotId} = useParams();

  const navigate = useNavigate();

  const [devotees,setDevotees] = useState([
    {name:"",age:"",gender:""}
  ]);

  const handleChange = (index,field,value)=>{

    const newDevotees = [...devotees];

    newDevotees[index][field] = value;

    setDevotees(newDevotees);
  };

  const addDevotee = ()=>{

    setDevotees([
      ...devotees,
      {name:"",age:"",gender:""}
    ]);

  };
  const removeDevotee = (index) => {

const updated = devotees.filter((_,i)=>i!==index);

setDevotees(updated);

setPersons(updated.length);

};

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      await API.post("/bookings",{
        slotId,
        devotees
      });

      alert("Booking successful");

      navigate("/my-bookings");

    }catch(err){

      alert("Booking failed");

    }

  };

  return(

    <>
    <Navbar/>

    <div className="container mt-4">

      <h3>Book Darshan</h3>

      <form onSubmit={handleSubmit}>

      {devotees.map((devotee,index)=>(

        <div key={index} className="card p-3 mb-3">

          <input
            className="form-control mb-2"
            placeholder="Name"
            onChange={(e)=>handleChange(index,"name",e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Age"
            onChange={(e)=>handleChange(index,"age",e.target.value)}
          />

          <select
            className="form-control"
            onChange={(e)=>handleChange(index,"gender",e.target.value)}
          >

            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>

          </select>

        </div>

      ))}

      <button
        type="button"
        className="btn btn-secondary me-3"
        onClick={addDevotee}
      >
        Add Devotee
      </button>
      
      <button
      className="btn btn-danger w-100"
      onClick={()=>removeDevotee(index)}
      >
      Remove
      </button>

      <button className="btn btn-success">
        Confirm Booking
      </button>

      </form>

    </div>

    </>
  );
}

export default Booking;