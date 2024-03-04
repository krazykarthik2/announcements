import React from "react";
import { FaSpinner, FaSync, FaSyncAlt } from "react-icons/fa";

function Loading() {
  return (
    <div className="vw-100 vh-100 d-center position-absolute top-0 start-0">
      <div className="loading d-center flex-column">
        <div className="icon">
          <FaSyncAlt size={"60px"}  />
        </div>
        <div className="text">loading</div>
      </div>
    </div>
  );
}

export default Loading;
