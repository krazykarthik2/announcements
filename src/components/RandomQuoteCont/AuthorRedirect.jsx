import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import {
  FaInfoCircle,
  FaSearch
} from "react-icons/fa";
import { FaWikipediaW } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  LeftMostNavigate,
  LeftNavigate,
  RightMostNavigate,
  RightNavigate,
} from "./Navs";

function AuthorRedirect() {
 const params = useParams();
 const navigate = useNavigate();
  useEffect(() => {
    
      const url =
        "https://api.quotable.io/search/authors?query=" +
        params.author +
        "&limit=1" 
        
        
      window.url = url;
      axios
        .get(url)
        .then((res) => {
          navigate("/quote/author/id/"+res.data.results[0]._id)
        })
        .catch((e) => {
          console.log(e);
        });
    
  }, []);

  return (
   <div className="loading">
    loading
   </div>
  );
}
export default AuthorRedirect;
