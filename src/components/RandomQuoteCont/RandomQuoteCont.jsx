import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaBackward,
  FaForward,
  FaRedo,
  FaSearch,
} from "react-icons/fa";
import "./index.css";

import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import RandomQuote from "../../utils/RandomQuote";
import { Col, Container, Row } from "react-bootstrap";
function RandomQuoteCont() {
  const [quote, setQuote] = useState(null);
  const params = useParams();
  const [quoteList, setQuoteList] = useState([]);
  const navigate = useNavigate();
  function updateQuote(id) {
    setQuote({ loading: true });
    axios
      .get("https://api.quotable.io/" + (id ? "quotes/" + id : "random"))
      .then((res) => {
        setQuote(res.data);
        if (id) {
        } else {
          navigate("/quote/" + res.data._id);
        }
        setQuoteList((e) => [...e, res.data._id]);
      })
      .catch((e) => {
        console.log(e);
      });
    if (id) navigate("/quote/" + id);
  }
  function goBack() {
    if (quoteList.length > 2) {
      updateQuote(quoteList[quoteList.length - 2]._id);
      setQuoteList((e) => e.slice(0, e.length - 2));
    }
  }
  useEffect(() => {
    if (quote == null) {
      updateQuote(params.id);
    }
  }, [params]);
  return (
    <div className="random-quote-page vw-100 vh-100 vstack justify-content-between bg-dark text-white">
      <div className="hstack justify-content-between p-5">
        <div className="heading h4">Quotes</div>
        <Link to={"/quote/search"} className="search text-white">
          <FaSearch size={"30px"} />
        </Link>
      </div>
      <div className="d-flex flex-column  p-2 bottom-0 position-relative">
        <div className="quote-cont ">
          <RandomQuote quote={quote} />
        </div>
        <div
          className="bg position-absolute w-100 h-100 text-gray pe-none font-px-100 fw-bold opacity-50 d-center"
          style={{ zIndex: 0 }}
        >
          {quoteList.length}
        </div>
      </div>
      <div className="bottom">
        <div className="sth position-relative pe-none">
          <div className="name mx-2 opacity-50 text-gray fw-bold transform-middle-rotate-90  w-0 start-0  position-absolute">
            {quote?._id}
          </div>
        </div>
        <div className="hstack w-100 justify-content-between">
          <div className="left rounded-circle p-3">
            <FaRedo />
          </div>
          <button
            className="btn center rounded-circle p-3 text-white border-0"
            onClick={() => {
              updateQuote();
            }}
          >
            <FaArrowDown />
          </button>
          <button
            className="btn text-white right rounded-circle p-3"
            onClick={() => {
              goBack();
            }}
          >
            <FaBackward />
          </button>
        </div>
      </div>
    </div>
  );
}
export default RandomQuoteCont;
