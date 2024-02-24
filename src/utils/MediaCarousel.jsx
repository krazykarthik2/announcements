import { useEffect, useMemo, useRef, useState } from "react";
import { Carousel } from "react-bootstrap";

let curIndex =0;
function MediaCarousel({ mediaItems }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleVideoEnded = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex((e) => (e + 1) % mediaItems.length);
      curIndex++;
    }
  };

  window.timeInterval = [];
  useEffect(() => {
    let timeInterval;
    timeInterval = setInterval(() => {
      if (mediaItems[curIndex]?.type.startsWith("image")||mediaItems[curIndex]?.type.startsWith("application/pdf")) {
        document.querySelectorAll("video").forEach((video) => {
          video.pause();
        }) 
        setCurrentIndex((e) => (e + 1) % mediaItems.length);
        curIndex++;
        curIndex%=mediaItems.length
      }
      if (mediaItems[curIndex]?.type.startsWith("video")) {
        
        let currentVideo = carouselRef.current.element
          .querySelector("video#id_" + (curIndex));
        if (!currentVideo.paused) {
        } else currentVideo.play();
      }
    }, 2000);
    window.timeInterval.push(timeInterval);
    return () => clearInterval(timeInterval);
  }, [mediaItems]);

  return (
    <Carousel
      className="w-100 h-100"
      activeIndex={currentIndex}
      onSelect={(index) => false}
      interval={null}
      ref={carouselRef}
    >
      {mediaItems.map((item, index) => (
        <Carousel.Item key={index}>
          <div className="w-100 h-100 d-center">
            {item.type.startsWith("image") ? (
              <img className="h-100" src={item.url} alt={`Slide ${index}`} />
            ) : item.type.startsWith("video") ? (
              <video
                className="h-100"
                src={item.url}
                id={"id_" + index}
                controls
                onEnded={handleVideoEnded}
              />
            ) : (
              <div className="d-block w-100 h-100">
                <div className="d-center w-100 h-100">
                  Unsupported media type: {item.type}
                </div>
              </div>
            )}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
export default MediaCarousel;
