import React from "react";

function Bytes({ value }) {
  const KB = value / 1024;
  const MB = value / (1024 * 1024);
  const GB = value / (1024 * 1024 * 1024);

  return (
    <span className="bytes">
      {GB < 1 ? (
        MB < 1 ? (
          KB < 1 ? (
            <div className="inB">{value + "B"}</div>
          ) : (
            <div className="inKB">{KB.toFixed(2) + "KB"}</div>
          )
        ) : (
          <div className="inMB">{MB.toFixed(2) + "MB"}</div>
        )
      ) : (
        <div className="inGB">{GB.toFixed(2) + "GB"}</div>
      )}
    </span>
  );
}

export default Bytes;
