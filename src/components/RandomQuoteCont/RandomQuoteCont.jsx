import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBackward,
  FaForward,
  FaSearch,
} from "react-icons/fa";
import "./index.css";

import { Link, useParams } from "react-router-dom";
import RandomQuote from "../../utils/RandomQuote";
import { Col, Container, Row } from "react-bootstrap";
function RandomQuoteCont() {
  const [quote, setQuote] = useState(null);
  const params = useParams();
  useEffect(() => {
    if (quote == null || quote?.loading) {
      setQuote({ loading: true });
      axios
        .get(
          "https://api.quotable.io/" +
            (params.id ? "quotes/" + params.id : "random")
        )
        .then((res) => {
          setQuote(res.data);
        });
    }
  }, [params]);
  return (
    <div className="vw-100 vh-100 vstack justify-content-between bg-dark text-white">
      <div className="hstack justify-content-between p-5">
        <div className="heading h4">Quotes</div>
        <Link to={"/quote/search"} className="search text-white">
          <FaSearch size={"30px"}/>
        </Link>
      </div>
      <div className="quote-cont p-5">
        <RandomQuote quote={quote} />
      </div>
      <div className="bottom"></div>
    </div>
  );
}
export default RandomQuoteCont;