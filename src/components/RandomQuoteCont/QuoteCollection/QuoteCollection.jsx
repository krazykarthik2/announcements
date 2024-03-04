import React from "react";
import QuoteOnly from "../../../utils/QuoteOnly";
import RandomQuote from "../../../utils/RandomQuote";
import { LeftNavigate, RightNavigate } from "../Navs";
import "./index.css";

export function QuoteCollection({
  data,
  setSearchParams,
  limit,
  quotes,
  commonAuthor = false,
}) {
  return (
    <div
      className={
        "quote-collection-cont hstack vw-100 align-items-center   " +
        ((quotes.length==0)
          ? " cont-loading "
          : "")
      }
    >
      <LeftNavigate {...{ data, setSearchParams, size: "50px" }} />

      <div className="quotes d-flex flex-column">
        {data && (
          <div className="quotes-index">
            {(data?.page - 1) * limit}-{(data?.page - 1) * limit + data?.count}/
            {data?.totalCount}
          </div>
        )}
        <div
          className="real-quotes vstack gap-5"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {quotes.map((quote) =>
            commonAuthor ? (
              <QuoteOnly key={quote._id} quote={quote} />
            ) : (
              <RandomQuote key={quote._id} quote={quote} />
            )
          )}
        </div>
      </div>
      <RightNavigate {...{ data, setSearchParams, size: "50px" }} />
    </div>
  );
}
