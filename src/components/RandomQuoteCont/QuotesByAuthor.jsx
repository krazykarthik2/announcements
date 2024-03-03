import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import QuoteOnly from "../../utils/QuoteOnly";
import { LeftNavigate, RightNavigate } from "./Navs";
import { FaInfoCircle } from "react-icons/fa";
import { QuoteCollection } from "./QuoteCollection/QuoteCollection";

function QuotesByAuthor() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  window.data = data;
  useEffect(() => {
    setQuotes(data?.results || []);
  }, [data]);
  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.quotable.io/quotes?author=${params.author}&page=${
          searchParams.get("page") || 1
        }&limit=${limit}`
      )
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [params]);
  return (
    <div
      className="vw-100 vh-100 d-flex flex-column text-white bg-dark justify-content-between"
      style={{ maxHeight: "100vh" }}
    >
      {loading ? (
        "loading"
      ) : (
        <>
          <div className="author-intro-sec">
            <Link
              className="author-section text-white text-decoration-none"
              to={`/author/${params.author}/about`}
            >
              <div className="author h5">
                <div className="name">{quotes[0]?.author}</div>
                <div className="quotes-noted">{data.totalCount} quotes</div>
              </div>
            </Link>
            <div className="hstack justify-content-end">
              <Link className="more-authors text-white" to="about">
                <FaInfoCircle size={"20px"} />
                <span>about</span>
              </Link>
            </div>{" "}
            <div className="hstack justify-content-end">
              <Link className="more-authors text-white" to="/quote/authors">
                more authors
              </Link>
            </div>
          </div>

          <div className="bottom">
            <QuoteCollection {...{ data, setSearchParams, limit, quotes,commonAuthor:true }} />
            <div className="pagination d-center">
              {data?.page}/{data?.totalPages}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default QuotesByAuthor;
