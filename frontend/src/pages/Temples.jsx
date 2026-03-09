

import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Temples(){

  const [temples,setTemples] = useState([]);
  const [search,setSearch] = useState("");

  const navigate = useNavigate();

  const fetchTemples = async(searchTerm="")=>{

    try{

      const res = await API.get(`/temples?search=${searchTerm}`);

      setTemples(res.data.data);

    }catch(err){
      console.log(err);
    }

  };

  useEffect(()=>{

    fetchTemples();

  },[]);

  const handleSearch = (e)=>{

    e.preventDefault();

    fetchTemples(search);

  };

  return(

    <>
    <Navbar/>

    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Explore Temples
      </h2>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="d-flex mb-4">

        <input
          className="form-control me-2"
          placeholder="Search by temple name or location..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <button className="btn btn-primary">
          Search
        </button>

      </form>

      <div className="row">

        {temples.map((temple)=>(
          
          <div className="col-md-4 mb-4" key={temple._id}>

            <div
              className="card shadow h-100"
              style={{cursor:"pointer"}}
              onClick={()=>navigate(`/temples/${temple._id}`)}
            >

              {/* IMAGE FIX */}
              <img
                src={
                  temple.image?.url
                    ? temple.image.url
                    : "https://via.placeholder.com/400x250"
                }
                className="card-img-top"
                style={{height:"220px",objectFit:"cover"}}
              />

              <div className="card-body">

                <h5 className="card-title">
                  {temple.name}
                </h5>

                <p className="text-muted">
                  📍 {temple.location}
                </p>

                <p>
                  {temple.description}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    </>
  );

}

export default Temples;