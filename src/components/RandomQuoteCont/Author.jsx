import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RandomQuote from "../../utils/RandomQuote";
import { FaRedo } from "react-icons/fa";
import QuoteOnly from "../../utils/QuoteOnly";

function Author() {
  const params = useParams();
  const [data, setData] = useState({});
  const [random, setRandom] = useState(null);
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
    <div className="author vh-100 w-100 d-flex flex-column bg-dark text-white justify-content-between">
      <div className="details">
        <h1>{data?.name}</h1>
        <h2>{data?.description}</h2>
        <h3>{data?.quoteCount} Quotes</h3>
        <p>{data?.bio}</p>
        <Link to={data?.link}>wiki link</Link>
      </div>
      <div className="middle hstack px-3 justify-content-between">
        <div className="quote-random w-100 d-center">
          {random!=null && <QuoteOnly quote={data?.quotes[random]} />}
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
        <div className="meta">
          <div className=" date-added hstack gap-2">
            <div className="label date-added">Date Added</div>
            <div className="">{data?.dateAdded}</div>
          </div>
          <div className=" date-modifed hstack gap-2">
            <div className="label date-modifed">Date Modified</div>
            <div className="">{data?.dateModified}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Author;
