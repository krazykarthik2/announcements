// Announcements.js
import React, { useState, useEffect, useMemo, useTransition } from "react";
import { refStorage, storage } from "../../utils/firebase";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
} from "firebase/storage";
import "./index.css";

import Bytes from "../../utils/Bytes"; // Import the Bytes component
import { Link } from "react-router-dom";
import { Carousel, CarouselItem } from "react-bootstrap";
import MediaCarousel from "../../utils/MediaCarousel";
function Display() {
  const [items, setItems] = useState([]);
  const [urlMap, setURLMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectIndex, setSelectIndex] = useState(0);
  window.items = items;
  window.urlMap = urlMap;
  useMemo(() => {
    // Fetch items from Firebase Storage
    setIsLoading(true);
    const storageRef = refStorage(storage, "/announcements/");
    listAll(storageRef)
      .then((result) => {
        result.items.forEach((itemRef) => {
          if (urlMap.has(itemRef)) return;
          getMetadata(itemRef).then((metadata) => {
            let {
              bucket,
              contentType,
              fullPath,
              generation,
              md5Hash,
              name,
              size,
              timeCreated,
              type,
              updated,
            } = metadata;
            setURLMap((prevMap) => {
              console.log(prevMap);
              let map = prevMap;
              map.set(itemRef.fullPath, {
                url: prevMap.get(itemRef.fullPath)?.url || "",
                metadata: {
                  bucket,
                  contentType,
                  fullPath,
                  generation,
                  md5Hash,
                  name,
                  size,
                  timeCreated,
                  type,
                  updated,
                },
              });
              setItems(Array.from(map.values()).sort((a, b) => a.metadata.updated - b.metadata.updated));
              return map;
            });
          });
          getDownloadURL(itemRef).then((url) => {
            setURLMap((prevMap) => {
              console.log(prevMap);
              let map = prevMap;
              map.set(itemRef.fullPath, {
                metadata: prevMap.get(itemRef.fullPath)?.metadata || {},
                url: url,
              });
              setItems(Array.from(map.values()));
              return map;
            });
          });
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("syncing urlMap to items");
    setItems(Array.from(urlMap.values()));
  }, [urlMap, setURLMap]);

  return (
    <div
      className={
        isLoading
          ? "loading pe-none vw-100 vh-100 vstack align-items-center justify-content-between"
          : "vw-100 vh-100 vstack align-items-center justify-content-between"
      }
    >
      {isLoading && (
        <div className="loading-overlay position-absolute top-50 start-50 translate-middle bg-glass">
          Loading...
        </div>
      )}

      <h2
        className="position-absolute text-white d-flex px-2 py-2 justify-content-between w-100 align-items-center"
        style={{ zIndex: 9999999 }}
      >
        <div className="vishnu">Vishnu</div>

        <div className="krazy vstack align-items-end">
          <div className="name">karthikkrazy</div>
          <div className="website">
            <FaEarthAmericas /> karthikkrazy.web.app
          </div>
        </div>
      </h2>
      {isLoading == false && items.length == 0 ? (
        <div className="no-items">No items</div>
      ) : (
        <MediaCarousel mediaItems={items.map((e) => ({type:e?.metadata?.contentType,url:e?.url}))}/>
        // <Carousel
        //   activeIndex={selectIndex}
        //   slide={true}
        //   controls={false}
        //   onSelect={(e) => {
        //     if (e == selectIndex) return;
        //     setSelectIndex(e);
        //   }}
        //   onSlide={(e) => {
        //     if (e == selectIndex) return;
        //     if (items[e].metadata.contentType.startsWith("video")) return false;
        //     setSelectIndex(e);
        //   }}
        //   wrap={true}
        //   className=" itemList gap-2 overflow-hidden"
        //   style={{ height: "100vh", width: "100%" }}
        // >
        //   {items.map((item, index) => (
        //     <Carousel.Item
        //       style={{
        //         width: "100%",
        //         height: "100%",
        //       }}
        //       interval={1000}
        //       className="item-single d-flex justify-content-center align-items-center"
        //       key={index}
        //     >
        //       <div
        //         className="content-full d-flex align-items-center justify-content-center"
        //         style={{
        //           width: "100%",
        //           height: "100%",
        //         }}
        //       >
        //         {item?.metadata?.contentType.startsWith("image") ? (
        //           <img
        //             className="pe-none"
        //             src={item.url}
        //             alt={`Image ${index}`}
        //             style={{ height: "100%", width: "auto" }}
        //           />
        //         ) : item?.metadata?.contentType.startsWith("video") ? (
        //           <video
        //             className="pe-none"
        //             controls={true}
        //             onSeeked={(e) => {
        //               console.log(this.currentTime);
        //             }}
        //             onEnded={() =>
        //               setSelectIndex((e) => (e < items.length - 1 ? e + 1 : 0))
        //             }
        //             src={item.url}
        //             style={{ height: "100%", width: "auto" }}
        //           />
        //         ) : (
        //           <div
        //             className="pe-none text-center d-flex flex-column  justify-content-center align-items-center rounded-4"
        //             style={{
        //               width: "100%",
        //               height: "100%",
        //               background: "#456",
        //             }}
        //           >
        //             Unsupported Format
        //             <span style={{ fontSize: "10px" }}>
        //               {item.metadata.contentType}
        //             </span>
        //           </div>
        //         )}
        //       </div>
        //       {/* <div className="vstack details position-absolute bottom-0" style={{ fontSize: "5px" }}>
        //         <div className="name item-detail">{item.metadata.name}</div>

        //         <div className="fullPath item-detail">
        //           {item.metadata.fullPath}
        //         </div>

        //         <div className="size item-detail">
        //           <Bytes value={Number(item.metadata.size)} />
        //         </div>
        //         <div className="time item-detail">
        //           uploaded at: {item.metadata.timeCreated}
        //         </div>
        //         <div className="type item-detail">
        //           type:{item.metadata.contentType}
        //         </div>
        //       </div> */}
        //     </Carousel.Item>
        //   ))}
        // </Carousel>
      )}
    </div>
  );
}

export default Display;
