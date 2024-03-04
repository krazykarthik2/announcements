import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link, useParams, useSearchParams } from "react-router-dom";
import QuoteOnly from "../../utils/QuoteOnly";
import RandomQuote from "../../utils/RandomQuote";
import {
  LeftMostNavigate,
  LeftNavigate,
  RightMostNavigate,
  RightNavigate,
} from "./Navs";
import { QuoteCollection } from "./QuoteCollection/QuoteCollection";
function SearchQuotes() {
  const [tags, setTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const query = searchParams.get("query");
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    setResults(data?.results || []);
  }, [data]);

  const setQuery = (query) => {
    setSearchParams((e) => {
      e.set("query", query);
      return e;
    });
  };
  useMemo(() => {
    axios
      .get("https://api.quotable.io/tags")
      .then((res) => {
        console.log(res.data);
        setTags(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    if (query)
      axios
        .get(
          `https://api.quotable.io/search/quotes?query=${query}&limit=${limit}&page=${
            searchParams.get("page") || 1
          }`
        )
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    else setData(null);
  }, [searchParams]);
  return (
    <div className="w-100 vh-100 overflow-hidden vstack justify-content-between bg-dark text-white gap-5  ">
      <div className="top pt-4">
        <div className="heading h3 d-center">Search Quotes</div>
        <div className="search hstack px-3 ">
          <Link className="btn border-0 text-white back nav" to="../">
            <FaArrowLeft />
          </Link>
          <input
            type="text"
            className="form-control  text-white bg-transparent"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn border-0 text-white"
            onClick={(e) => setQuery("")}
          >
            <RxCross2 />
          </button>
          <button className="btn border-0 text-white">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="middle px-2">
        <QuoteCollection
          {...{ data, setSearchParams, limit, quotes: results }}
        />
      </div>
      <div className={"bottom" + (tags.length == 0 ? " cont-loading " : "")}>
        <div className="tags d-flex justify-content-center mb-3 align-items-center flex-wrap gap-2" >
          {tags
            .filter((e) => {
              if (query == null) {
                return e;
              } else if (
                query
                  .toLocaleLowerCase()
                  .split(" ")
                  .filter((e) => e)
                  .some((x) => e.name.toLowerCase().includes(x))
              ) {
                return e;
              }
            })
            .map((tag, index) => (
              <Link
                to={`../tags/${tag.name.toLowerCase().split(" ").join("-")}`}
                className="tag text-white text-decoration-none d-inline-flex rounded-pill px-2 py-1 gap-2 bg-secondary"
                key={tag._id}
              >
                <div className="">{tag.name}</div>
                <div className="badge bg-info d-center text-dark">
                  {tag.quoteCount}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SearchQuotes;
