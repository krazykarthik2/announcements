import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { QuoteCollection } from "./QuoteCollection/QuoteCollection";

function QuotesByTag() {
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
        `https://api.quotable.io/quotes?tags=${params.tag}&page=${
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
          <div className="tag-intro-sec">
            <div className="tag-section text-white text-decoration-none">
              <div className="tag">
                <div className="name h3">{params.tag}</div>
                <div className="quotes-noted h5">{data.totalCount} quotes</div>
              </div>
            </div>

            <div className="hstack justify-content-end">
              <Link className="more-tags text-white" to="/quote/tags">
                more tags
              </Link>
            </div>
          </div>

          <div className="bottom mb-3">
            <QuoteCollection {...{ data, setSearchParams, limit, quotes }} />
            <div className="pagination d-center">
              {data?.page}/{data?.totalPages}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default QuotesByTag;
