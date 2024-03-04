import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RandomQuote from "../../utils/RandomQuote";
import { FaArrowLeft, FaRedo, FaWikipediaW } from "react-icons/fa";

import QuoteOnly from "../../utils/QuoteOnly";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

function Author() {
  const params = useParams();
  const [data, setData] = useState({});
  const [random, setRandom] = useState(null);
  window.data = data;
  useEffect(() => {
    axios
      .get(`https://api.quotable.io/authors/${params.author_id}`)
      .then((result) => {
        setData(result.data);
        setRandom(Math.floor(Math.random() * result.data.quoteCount));
      })
      .catch((e) => console.log(e));
  }, [params]);
  return (
    <div
      className={
        "author h-100 w-100 d-flex flex-column bg-dark text-white justify-content-between" +
        (Object.keys(data).length == 0 ? " cont-loading " : "")
      }
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex align-items-start back nav">
        <Link className="btn border-0 text-white" to={"../"}>
          <FaArrowLeft />
        </Link>
      </div>
      <div className="details px-2">
        <h1>{data?.name || "xxxxxx xx xxxxx"}</h1>
        <h2>{data?.description || "xxx x x x  xxxx x xxx xx x x "}</h2>
        <h3>
          {data?.quoteCount || "xxx"}
          <div className="const d-inline ms-2">quotes</div>
        </h3>
        <p>
          {data?.bio ||
            "xxxx xxxxxxxxxx x xx  x xx xxxx x xx x xxxxxxxx xx  x x xxx xx x x xxxx xxxxxxxxxx x xxxxxx x xxxxxxxxx xxxx xxxxxxx xxx xxxxxxx xxxx xxxx x xxx x xxx xxxxxx x xxxxx xxxxxx x xxx xx xxxxxxx "}
        </p>
        <Link
          to={data?.link}
          target="_blank"
          className="d-inline-flex gap-2 text-white text-decoration-none action"
        >
          <div className="icon">
            <FaWikipediaW />
          </div>
          <span>wiki link</span>
          <div className="icon">
            <FaArrowUpRightFromSquare />
          </div>
        </Link>
      </div>
      <div className="middle hstack px-3 justify-content-between">
        <div className="quote-random w-100 d-center">
          <QuoteOnly quote={data?.quotes ? data?.quotes[random] : null} />
        </div>
        <button
          className="btn border-0 text-white m-4 p-0"
          onClick={() =>
            setRandom(Math.floor(Math.random() * data?.quoteCount))
          }
        >
          <FaRedo />
        </button>
      </div>
      <div className="bottom d-flex flex-column align-items-end">
        <table className="meta gap-2">
         
          <tbody>
            <tr className=" date-added  " >
              <td className="label date-added const px-4">Date Added</td>
              <td className="">{data?.dateAdded || "**|**|****"}</td>
            </tr>
            <tr className=" date-modifed ">
              <td className="label date-modifed const px-4">Date Modified</td>
              <td className="">{data?.dateModified || "**|**|****"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Author;
