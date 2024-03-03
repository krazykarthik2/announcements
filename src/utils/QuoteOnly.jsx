import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShareQuote } from "./ShareQuote";
import { Tag } from "./RandomQuote";
function QuoteOnly({ quote }) {
  return (
    <div className="quote-cont text-white d-flex flex-column">
      {quote == null ? (
        <div className="isLoading">loading quote</div>
      ) : (
        <>
          <div className="quote h4">{quote?.content}</div>
          <div className="hstack justify-content-between">
            <ShareQuote quote={quote} />
            <div className="tags text-end gap-2 hstack justify-content-end">
              {quote?.tags?.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default QuoteOnly;

