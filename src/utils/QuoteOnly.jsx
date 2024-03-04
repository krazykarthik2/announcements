import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShareQuote } from "./ShareQuote";
import { Tag } from "./RandomQuote";
function QuoteOnly({ quote }) {
  return (
    <div className={"quote-cont text-white d-flex flex-column" + ((quote==null||quote.loading)?" cont-loading ":"")}>
      <div className="quote h4">
        {quote
          ? quote?.content
          : "xxxx xxxx xx xxx xxxxxxxxx xxxxx xxx xxx xxx xxxx xxxx xxx xx xxxxx xxx"}
      </div>
      <div className="hstack justify-content-between flex-wrap">
        <ShareQuote quote={quote} />
        <div className="tags flex-wrap text-end gap-2 hstack justify-content-end">
          {quote?.tags?.map((tag, index) => (
            <Tag key={index} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuoteOnly;
