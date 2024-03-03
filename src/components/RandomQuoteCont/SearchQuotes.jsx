import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link, useParams, useSearchParams } from "react-router-dom";
import QuoteOnly from "../../utils/QuoteOnly";
import RandomQuote from "../../utils/RandomQuote";
function SearchQuotes() {
  const [tags, setTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const query = searchParams.get("query");
  const [data, setData] = useState(null);
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
        .get(`https://api.quotable.io/search/quotes?query=${query}&limit=10`)
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        });
    else setData(null);
  }, [searchParams]);
  return (
    <div className="w-100 vh-100 overflow-hidden vstack justify-content-between bg-dark text-white gap-5  ">
      <div className="top pt-4">
        <div className="heading h3 d-center">Search Quotes</div>
        <div className="search hstack px-3">
          <input
            type="text"
            className="form-control  text-white bg-transparent"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link className="btn text-white" to="../">
            <RxCross2 />
          </Link>
          <button className="btn text-white">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="middle overflow-y-auto">
        <div className="quotes vstack gap-5">
          {results.map((quote, index) => (
            <RandomQuote key={index} quote={quote} />
          ))}
        </div>
      </div>
      <div className="bottom">
        <div className="tags d-flex justify-content-center mb-5 align-items-center flex-wrap gap-2">
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