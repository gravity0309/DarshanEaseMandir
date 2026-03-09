

import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function TicketPage(){

const { id } = useParams();

const [loading,setLoading] = useState(false);

const downloadTicket = async () => {

try{

setLoading(true);

const response = await API.get(
`/bookings/${id}/ticket`,
{ responseType: "blob" }
);

const url = window.URL.createObjectURL(new Blob([response.data]));

const link = document.createElement("a");

link.href = url;

link.setAttribute("download","temple-ticket.pdf");

document.body.appendChild(link);

link.click();

link.remove();

}catch(err){

console.log(err);
alert("Ticket download failed");

}

setLoading(false);

};

return(

<>
<Navbar/>

<div className="container mt-5 text-center">

<div className="card shadow p-5">

<h3 className="mb-3">Booking Successful 🎉</h3>

<p className="text-muted">
Your darshan slot has been booked successfully.
Download your ticket below.
</p>

<button
className="btn btn-success mt-3"
onClick={downloadTicket}
disabled={loading}
>
{loading ? "Downloading..." : "Download Ticket"}
</button>

</div>

</div>

</>

);
}

export default TicketPage;