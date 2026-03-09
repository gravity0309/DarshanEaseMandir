import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Temples from "../pages/Temples";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyBookings from "../pages/MyBookings";
import Donate from "../pages/Donate";
import About from "../pages/About";      // ✅ ADD THIS
import Contact from "../pages/Contact"; 
import TempleDetails from "../pages/TempleDetails";
import TicketPage from "../pages/TicketPage";
import BookingPage from "../pages/BookingPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRevenue from "../pages/AdminRevenue";
import AdminTemples from "../pages/AdminTemples";
import AdminUsers from "../pages/AdminUsers";
import AdminBookings from "../pages/AdminBookings";
import AdminDonations from "../pages/AdminDonations";
import AdminSlotManagement from "../pages/AdminSlots";
import MyDonations from "../pages/MyDonations";
function AppRoutes(){

  return(

    <Routes>

      <Route path="/" element={<Landing/>}/>

      <Route path="/temples" element={<Temples/>}/>
      <Route path="/temples/:id" element={<TempleDetails />} />

      <Route path="/login" element={<Login/>}/>

      <Route path="/register" element={<Register/>}/>

      <Route path="/my-bookings" element={<MyBookings/>}/>

      <Route path="/donate" element={<Donate/>}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/ticket/:id" element={<TicketPage/>}/>
      <Route path="/booking/:slotId" element={<BookingPage/>}/>
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      <Route path="/admin/temples" element={<AdminTemples/>}/>
      <Route path="/admin/users" element={<AdminUsers/>}/>
      <Route path="/admin/revenue" element={<AdminRevenue/>}/>
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/donations" element={<AdminDonations />} />
      <Route path="/admin/slots/:templeId" element={<AdminSlotManagement />} />
      <Route path="/my-donations" element={<MyDonations />} />

    </Routes>

  );

}

export default AppRoutes;