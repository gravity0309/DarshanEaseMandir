

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login(){

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      await login(email,password);

      navigate("/");

    }catch(err){

      alert("Invalid credentials");

    }

  };

  return(

    <>
    <Navbar/>

    <div className="container mt-5" style={{maxWidth:"400px"}}>

      <h3 className="mb-4 text-center">Login</h3>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-3"
          placeholder="Email"
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

        <button className="btn btn-warning w-100">
          Login
        </button>

      </form>

    </div>
    </>
  );
}

export default Login;