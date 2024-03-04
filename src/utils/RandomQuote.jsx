import React from "react";
import { Link } from "react-router-dom";
import { ShareQuote } from "./ShareQuote";
function RandomQuote({ quote }) {
  window.quote = quote;
  return (
    <div className="quote-cont text-white d-flex flex-column ">
      {!quote || quote.loading == true ? (
        <>
          <div className="quote h4">loading quote......</div>
          <div className="hstack justify-content-between flex-wrap">
            <ShareQuote quote={quote} />
            <Link
              className="author h3 text-end pe-none"
            >
              <div className="name">~dev</div>
            </Link>
          </div>
          <div className="tags text-end gap-2 hstack justify-content-end">
            {quote?.tags?.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="quote h4">{quote?.content}</div>
          <div className="hstack justify-content-between">
            <ShareQuote quote={quote} />
            <Link
              className="author h3 text-end"
              to={`/quote/author/${quote?.authorSlug}`}
            >
              <div className="name">~{quote?.author}</div>
              <div className="desc">{quote?.description}</div>
            </Link>
          </div>
          <div className="tags text-end gap-2 hstack justify-content-end">
            {quote?.tags?.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default RandomQuote;
export function Tag({ index, tag }) {
  return (
    <Link
      key={index}
      className="tag badge text-decoration-none  bg-secondary text-dark"
      style={{ fontSize: "17px" }}
      to={`/quote/tags/${tag.toLowerCase().split(" ").join("-")}`}
    >
      {tag}
    </Link>
  );
}
