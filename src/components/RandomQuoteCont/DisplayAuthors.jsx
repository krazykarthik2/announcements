import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaFilter,
  FaInfoCircle,
  FaRedo,
  FaSearch,
} from "react-icons/fa";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FaWikipediaW } from "react-icons/fa6";
import { Table } from "react-bootstrap";
import {
  LeftNavigate,
  LeftMostNavigate,
  RightMostNavigate,
  RightNavigate,
} from "./Navs";

function DisplayAuthors() {
  const [authors, setAuthors] = useState([]);
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(10);

  const params = useParams();
  const location = useLocation();
  window.params = params;
  window.lc = location;
  window.data = data;
  const [sortOpt, setSortOpt] = useState(null);
  const [orderOpt, setOrderOpt] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortOptions = ["name", "quoteCount"];
  const orderOptions = ["asc", "desc"];

  useEffect(() => {
    setAuthors(data?.results || []);
  }, [data]);
  useEffect(() => {
    const url =
      "https://api.quotable.io/authors?limit=" +
      limit +
      "&page=" +
      (searchParams.get("page") || 1) +
      "&" +
      location.search.substring(1);

    axios.get(url).then((res) => {
      setData(res.data);
      console.log(res.data);
    });

    if (location.search) {
      let opt_params = location.search.substring(1).split("&");
      let opts = {};
      opt_params.forEach(
        (e) => (opts = { ...opts, [e.split("=")[0]]: e.split("=")[1] })
      );
      if (opts["sortBy"]) {
        setSortOpt(sortOptions.findIndex((e) => e == opts["sortBy"]));
      }
      if (opts["order"]) {
        setOrderOpt(orderOptions.findIndex((e) => e == opts["order"]));
      }
    } else {
      setSortOpt(null);
      setOrderOpt(null);
    }
  }, [params, location]);

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
            "btn border-0 m-0 p-0 user-select-none text-decoration-none text-white " +
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
      <div className="header hstack justify-content-between px-4 pt-2">
        <div className="display-authors-title h2">Authors</div>
        <Link className="search-icon text-white " to={"/quote/authors/search"}>
          <FaSearch size="30px" />
        </Link>
      </div>

      {data == null ? (
        <div>loading</div>
      ) : (
        <div className="all-vstack">
          <div className="opt-cont hstack justify-content-between align-items-center px-5">
            <FaFilter size="70px" />
            <div className="d-flex gap-3 w-100 m-4">
              <div
                className="sortbyopts hstack gap-3
            text-white"
              >
                <div className="label">sort by :</div>
                {sortOptions.map((e, i) => (
                  <div key={i}
                    className={
                      "option" +
                      (i == sortOpt
                        ? " current bg-secondary rounded-pill py-1 px-2"
                        : " rounded-pill py-1 px-2 border border-secondary")
                    }
                  >
                    <Link
                      className="text-decoration-none text-white "
                      to={
                        "/quote/authors/" +
                        "?sortBy=" +
                        e +
                        (orderOpt != null
                          ? "&order=" + orderOptions[orderOpt]
                          : "")
                      }
                    >
                      {e}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="orderbyopts hstack gap-4">
                <div className="label">order by :</div>
                {orderOptions.map((e, i) => (
                  <div key={i}
                    className={
                      "option" +
                      (i == orderOpt
                        ? " current bg-secondary rounded-pill py-1 px-2"
                        : "  rounded-pill py-1 px-2 border border-secondary")
                    }
                  >
                    <Link
                      className="text-decoration-none text-white "
                      to={
                        "/quote/authors?order=" +
                        e +
                        (sortOpt != null
                          ? "&sortBy=" + sortOptions[sortOpt]
                          : "")
                      }
                    >
                      {[<FaArrowDown />, <FaArrowUp />][i]}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/quote/authors"
              className="clear clear-options text-white text-decoration-none"
            >
              <div className="vstack">
                <FaRedo />
              </div>
              <span>clear</span>
            </Link>
          </div>

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
                {...{ data, setSearchParams, location, size: "40px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DisplayAuthors;
