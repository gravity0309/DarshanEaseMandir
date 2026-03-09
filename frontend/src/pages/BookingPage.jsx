import { useParams,useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function BookingPage(){

const { slotId } = useParams();
const navigate = useNavigate();

const [visitDate,setVisitDate] = useState("");
const [persons,setPersons] = useState(1);
const [devotees,setDevotees] = useState([
{name:"",age:"",gender:"Male"}
]);

const handleDevoteeChange=(index,field,value)=>{

const updated=[...devotees];
updated[index][field]=value;
setDevotees(updated);

};

const addDevotee=()=>{

setDevotees([
...devotees,
{name:"",age:"",gender:"Male"}
]);

setPersons(devotees.length+1);

};

const submitBooking = async()=>{

try{

const res = await API.post("/bookings",{
slotId,
visitDate,
persons,
devotees
});

navigate(`/ticket/${res.data.booking._id}`);

}catch(err){
alert(err.response?.data?.message || "Booking failed");
}

};

return(

<>
<Navbar/>

<div className="container mt-4">

<h3>Book Darshan</h3>

<div className="card p-4 shadow">

<label>Visit Date</label>

<input
type="date"
className="form-control mb-3"
value={visitDate}
onChange={(e)=>setVisitDate(e.target.value)}
/>

<h5>Devotees</h5>

{devotees.map((dev,index)=>(
<div className="row mb-3" key={index}>

<div className="col">
<input
className="form-control"
placeholder="Name"
value={dev.name}
onChange={(e)=>handleDevoteeChange(index,"name",e.target.value)}
/>
</div>

<div className="col">
<input
type="number"
className="form-control"
placeholder="Age"
value={dev.age}
onChange={(e)=>handleDevoteeChange(index,"age",e.target.value)}
/>
</div>

<div className="col">
<select
className="form-control"
value={dev.gender}
onChange={(e)=>handleDevoteeChange(index,"gender",e.target.value)}
>
<option>Male</option>
<option>Female</option>
</select>
</div>

</div>
))}

<button
className="btn btn-secondary mb-3"
onClick={addDevotee}
>
Add Devotee
</button>

<button
className="btn btn-primary w-100"
onClick={submitBooking}
>
Confirm Booking
</button>

</div>

</div>

</>

);
}

export default BookingPage;