import React from "react";
import Bytes from "../utils/Bytes";

export function ProgressShow({ progress }) {
  return (
    Object.values(progress).filter((e) => e).length > 0 && (
      <div className="vstack w-100">
        Tracking Uploads...
        {Object.keys(progress).map((e) => (
          <ProgressEachShow progress={progress} key={e} progKey={e} />
        ))}
      </div>
    )
  );
}
function ProgressEachShow({ progress, progKey }) {
  const prog = progress[progKey];
  if (!prog) return null;
  return (
    <div key={progKey} className="hstack w-100 align-items-center justify-content-evenly">
      <p className="max-w-40">{progKey}</p>
      <progress value={prog.bytesTransferred} max={prog.totalBytes} />
      <p>{((100 * prog.bytesTransferred) / prog.totalBytes).toFixed(2)}%</p>
      <p>
        <Bytes value={prog.totalBytes - prog.bytesTransferred} />
        left
      </p>
    </div>
  );
}
