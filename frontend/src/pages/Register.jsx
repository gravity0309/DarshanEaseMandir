

import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    // simple validation
    if(!name || !email || !password){
      alert("All fields are required");
      return;
    }

    if(password.length < 6){
      alert("Password must be at least 6 characters");
      return;
    }

    try{

      setLoading(true);

      const res = await API.post("/auth/register",{
        name,
        email,
        password
      });

      console.log(res.data);

      alert("Registration successful");

      navigate("/login");

    }catch(err){

      console.log(err.response?.data);

      const message =
        err.response?.data?.message ||
        "Registration failed";

      alert(message);

    }finally{
      setLoading(false);
    }

  };

  return (

    <>
      <Navbar/>

      <div className="container mt-5" style={{maxWidth:"420px"}}>

        <div className="card shadow p-4">

          <h3 className="mb-4 text-center">Create Account</h3>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

        </div>

      </div>
    </>
  );

}

export default Register;