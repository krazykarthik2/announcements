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
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  LeftMostNavigate,
  LeftNavigate,
  RightMostNavigate,
  RightNavigate,
} from "./Navs";

function SearchAuthors() {
  const [authors, setAuthors] = useState([]);
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(7);
  const params = useParams();
  const location = useLocation();
  window.lc = location;
  window.data = data;
  const [searchParams,setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const setQuery = (query) => {
    setSearchParams((e) => ({ ...e, query: query, page: 1 }));
  };
  useEffect(() => {
    setAuthors(data?.results || []);
  }, [data]);
  useEffect(() => {
    if (query) {
      
      const url =
        "https://api.quotable.io/search/authors?query=" +
        query +
        "&limit=" +
        limit +
        "&page=" +
        (searchParams.get("page") || 1) +
        "&" +
        location.search.substring(1);
      window.url = url;
      axios
        .get(url)
        .then((res) => {
          setData(res.data);
          console.log(query);
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }else{
      setData(null);
    }
  }, [searchParams, location]);

  //dots
  const renderDots = (data) => {
    const dots = [];
    for (let i = 1; i <= data.totalPages; i++) {
      dots.push(
        <button
          onClick={() => {
            setSearchParams((e) => {
              e.set("page", i);
              return e;
            });
          }}
          key={i}
          className={
            "btn border-0 user-select-none text-decoration-none text-white " +
            (i == data.page ? "dot current pe-none" : "dot")
          }
        >
          {i == data.page ? i : "*"}
        </button>
      );
    }
    return dots;
  };
  ///dots
  return (
    <div className="display-authors w-100 vh-100 vstack justify-content-between bg-dark text-white">
      <div className="header d-flex flex-column justify-content-between px-4 pt-2">
        <div className="display-authors-title h2">Search Authors</div>

        <div className="hstack justify-content-between">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuery("")}
            >
              <RxCross2/>
            </button>  
            <div
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuery("")}
            >
              <FaSearch />
            </div>
          </div>
        </div>
        </div>

        {data == null ? (
          query==null?
          <div>loading</div>:
          <div className="w-100 d-center">Search authors here...</div>
        ) : (
          <div className="all-vstack">
            <div className="hstack nav-support bottom mb-3 justify-content-between px-2 ">
              <div className="left-nav">
                <LeftNavigate
                  {...{ data, setSearchParams, location, size: "40px" }}
                />
              </div>
              <div className="author-cont">
                <div className="no-nav-cont hstack justify-content-between">
                  <LeftMostNavigate
                    {...{ data, setSearchParams, location, size: "20px" }}
                  />
                  <div className="index-auth-cont">
                    {(data.page - 1) * limit}-
                    {(data.page - 1) * limit + data.count}/{data.totalCount}
                  </div>
                  <RightMostNavigate
                    {...{ data, setSearchParams, location, size: "20px" }}
                  />
                </div>
                <div className="w-100 d-center">
                  <Table
                    bordered
                    striped
                    hover
                    className="real-author-cont h5 w-fit-content align-items-center  fw-none vstack "
                  >
                    <tbody>
                      <tr>
                        <th>Author</th>
                        <th>Info</th>
                        <th>Wiki</th>
                      </tr>
                      {authors.map((author, index) => (
                        <tr key={index}>
                          <td>
                            <Link
                              to={`/quote/author/${author.slug}`}
                              className="bg-transparent author text-nowrap text-white text-decoration-none"
                              key={index}
                            >
                              {author.name}
                            </Link>
                          </td>
                          <td>
                            <Link
                              className="bg-transparent text-white text-decoration-none"
                              to={`/quote/author/id/${author._id}`}
                            >
                              <FaInfoCircle size="20px" />
                            </Link>
                          </td>
                          <td>
                            <Link
                              className="bg-transparent text-white text-decoration-none"
                              to={author.link}
                            >
                              <FaWikipediaW size="20px" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>{" "}
                </div>
                <div className="dots-nav d-center flex-wrap  align-content-center w-100 justify-content-evenly">
                  {renderDots(data)}
                </div>
              </div>
              <div className="right-nav">
                <RightNavigate
                  {...{ data, setSearchParams, location, size: "50px" }}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
export default SearchAuthors;
