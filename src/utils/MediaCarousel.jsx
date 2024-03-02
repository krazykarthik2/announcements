import { useMemo, useRef, useState } from "react";
import { Carousel } from "react-bootstrap";
import { MediaItem } from "./MediaItem";

function MediaCarousel({ mediaItems }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // const handleVideoEnded = () => {
  //   if (currentIndex < mediaItems.length - 1) {
  //     setCurrentIndex((e) => (e + 1) % mediaItems.length);
  //     curIndex++;
  //   }
  // };

  // window.timeInterval = [];
  // useEffect(() => {
  //   let timeInterval;
  //   timeInterval = setInterval(() => {
  //     if (mediaItems[curIndex]?.type.startsWith("image")||mediaItems[curIndex]?.type.startsWith("application/pdf")) {
  //       document.querySelectorAll("video").forEach((video) => {
  //         video.pause();
  //       })
  //       setCurrentIndex((e) => (e + 1) % mediaItems.length);
  //       curIndex++;
  //       curIndex%=mediaItems.length
  //     }
  //     if (mediaItems[curIndex]?.type.startsWith("video")) {

  //       let currentVideo = carouselRef.current.element
  //         .querySelector("video#id_" + (curIndex));
  //       if (!currentVideo.paused) {
  //       } else currentVideo.play();
  //     }
  //   }, 2000);
  //   window.timeInterval.push(timeInterval);
  //   return () => clearInterval(timeInterval);
  // }, [mediaItems]);

  return (
    <Carousel
      className="w-100 h-100"
      activeIndex={currentIndex}
      onSelect={(index) => false}
      controls={false}
      nextIcon={null}
      prevIcon={null}
      indicatorLabels={null}
      indicators={null}
      interval={null}
      ref={carouselRef}
    >
      <MediaItem
        item={mediaItems[currentIndex]}
        key={currentIndex}
        index={currentIndex}
        _timeout={5000}
        goToNext={() => setCurrentIndex((e) => (e + 1) % mediaItems.length)}
      />
      <div className="indic w-100 d-center position-absolute bottom-0">
        <div className="bg-glass px-4 py-2 h3 fw-bold mb-3">
          {currentIndex + 1}/{mediaItems.length}
        </div>
      </div>
    </Carousel>
  );
}
export default MediaCarousel;
