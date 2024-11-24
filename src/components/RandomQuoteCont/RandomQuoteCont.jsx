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
import { useSwipeable } from "react-swipeable";
import { upload } from "@testing-library/user-event/dist/upload";
function RandomQuoteCont() {
  const [quote, setQuote] = useState(null);
  const params = useParams();
  const [quoteList, setQuoteList] = useState([]);
  const [nextQuote, setNextQuote] = useState(null);
  const navigate = useNavigate();
  const [swipeEvent, setSwipeEvent] = useState(null);
  const handleSwipe = useSwipeable({
    onSwipedUp: () => {
      updateQuote();
    },
    onSwipedDown: () => {
      goBack();
    },
    onSwiped: () => {
      setSwipeEvent(null);
    },
    onSwiping: (e) => {
      console.log(e);
      setSwipeEvent(e);
    },
    preventScrollOnSwipe: true,
  });
  function updateQuote(id) {
    setQuote({ loading: true });
    if(quoteList.findIndex(e=>e._id==id)!=-1)
      setQuote(quoteList.findIndex(e=>e._id==id));
    else if
    
    else
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
  function loadNext(id) {
    axios
      .get("https://api.quotable.io/" + (id ? "quotes/" + id : "random"))
      .then((res) => {
        setNextQuote(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function goNext() {
    if (nextQuote == null) {
      loadNext();
    }
    updateQuote(nextQuote._id);
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
      <div className="main swipeable vstack " {...handleSwipe}>
        {quoteList.length > 1 && (
          <div
            className="d-flex flex-column w-100 h-100 pe-none user-select-none d-center align-items-stretch p-2 bottom-0 position-absolute"
            style={{
              transform: `translateY( calc( -100% + ${
                swipeEvent?.deltaY || 0
              }px ) )`,
              transition: swipeEvent == null ? "all .2s ease-out" : "",
            }}
          >
            <div className="quote-cont ">
              <RandomQuote quote={quoteList[quoteList.length - 2]} />
            </div>
          </div>
        )}
        <div
          className="bg-secondary d-flex flex-column w-100 h-100 pe-none user-select-none d-center align-items-stretch p-2 bottom-0 position-absolute"
          style={{
            transform: `translateY( calc( 100% + ${
              swipeEvent?.deltaY || 0
            }px ) )`,
            transition: swipeEvent == null ? "all .2s ease-out" : "",
          }}
        ></div>
        <div
          className="d-flex flex-column  h-100 d-center align-items-stretch p-2 bottom-0 position-relative"
          style={{
            transform: `translateY(${swipeEvent?.deltaY || 0}px)`,
            transition: swipeEvent == null ? "all .2s ease-out" : "",
          }}
        >
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
            <div className="next">
              <button
                className={
                  "btn text-white right rounded-circle p-3 border-0" +
                  (quoteList.length > 1 ? "" : "pe-none opacity-0")
                }
                onClick={() => {
                  goBack();
                }}
              >
                <FaBackward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RandomQuoteCont;
