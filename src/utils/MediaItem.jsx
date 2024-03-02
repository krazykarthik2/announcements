import { useEffect, useRef, useState } from "react";
import loading from "../assets/loading.gif";
import ColorThief from "colorthief";
export function MediaItem({ item, index, goToNext, _timeout: propTimeOut }) {
  function handleVideoEnded() {
    goToNext();
  }
  const [isLoaded, setIsLoaded] = useState(false);
  const mediaRef = useRef(null);
  window.isLoaded = isLoaded;
  useEffect(() => {
    if (item?.type.startsWith("video")) {
      if (isLoaded)
        if (mediaRef.current) {
          if (mediaRef.current.paused) mediaRef.current.play();
        }
    } else {
      if (isLoaded) {
        if (item?.type?.startsWith("image")) {
          try {
            let colorTheif = new ColorThief();
            window.colorTheif = colorTheif;
            if (mediaRef.current.complete) {
              let color = colorTheif.getColor(mediaRef.current, 10);
              console.log(color);
            }
          } catch (e) {
            console.log(e+'@colorthief')
          }
        }
        let timeOut_val = propTimeOut;
        let timeoutObject = setTimeout(() => {
          console.log("going");
          goToNext();
        }, timeOut_val);

        console.log("timeOut_val @ useEffect", timeOut_val);
        return () => {
          console.log("unmounting probably");
          clearTimeout(timeoutObject);
        };
      }
    }
  }, [item, mediaRef, propTimeOut, isLoaded]);

  return (
    <div className="w-100 h-100 d-center" key={index}>
      {item?.type.startsWith("image") ? (
        <img
          className="h-100"
          src={item?.url || loading}
          alt={`Slide ${index}`}
          ref={mediaRef}
          key={index}
          onLoad={() => setIsLoaded(true)}
        />
      ) : item?.type.startsWith("video") ? (
        <video
          className="h-100"
          src={item?.url}
          id={"id_" + index}
          controls={false}
          ref={mediaRef}
          key={index}
          onLoadedData={() => setIsLoaded(true)}
          onEnded={handleVideoEnded}
        />
      ) : (
        <div className="d-block w-100 h-100">
          <div className="d-center w-100 h-100">
            Unsupported media type: {item?.type}
          </div>
        </div>
      )}
    </div>
  );
}
