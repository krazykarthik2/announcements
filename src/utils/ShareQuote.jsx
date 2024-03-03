import React from "react";
import { Link } from "react-router-dom";
import { FaShareNodes, FaSquareArrowUpRight } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";

export function ShareQuote({ quote }) {
  return (
    <div className="left hstack gap-2">
      <button
        className="btn share text-white"
        onClick={() => {
          navigator.share({
            title: "quote by " + quote?.author,
            text: `${quote?.content} ~${quote?.author} \n for more quotes visit:https://vishnuxkrazy.netlify.app/quote`,
            url: `/quote/${quote?._id}`,
          });
        }}
      >
        <FaShareNodes size={"30px"} />
      </button>{" "}
      <button
        className="btn copy text-white"
        onClick={() => {
          navigator.clipboard.writeText(
            `${quote?.content} ~${quote?.author} \n for more quotes visit:https://vishnuxkrazy.netlify.app/quote`
          );
        }}
      >
        <FaCopy size={"30px"} />
      </button>
      <Link className="share text-white" to={`/quote/${quote?._id}`}>
        <FaSquareArrowUpRight size={"30px"} />
      </Link>
    </div>
  );
}
