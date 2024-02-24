// Announcements.js
import React, { useState, useEffect, useMemo, useTransition } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { refStorage, storage } from "../utils/firebase";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
} from "firebase/storage";
import Bytes from "../utils/Bytes"; // Import the Bytes component
import { Link } from "react-router-dom";
function Announcements() {
  const [items, setItems] = useState([]);
  const [urlMap, setURLMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
              setItems(Array.from(map.values()));
              return map;
            });
          });
          getDownloadURL(itemRef).then((url) => {
            setURLMap((prevMap) => {
              console.log(prevMap);
              let map = prevMap;
              map.set(itemRef.fullPath, {
                metadata: prevMap.get(itemRef.fullPath).metadata || {},
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };
  function deleteStorageItem(fullPath) {
    const objRef = refStorage(storage, fullPath);
    setIsDeleting(true);
    deleteObject(objRef)
      .then(() => {
        setItems((prevItems) =>
          prevItems.filter((item) => item.metadata.fullPath !== fullPath)
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  return (
    <div className={isDeleting || isLoading ? "loading pe-none vw-100 vh-100 vstack align-items-center justify-content-between" : "vw-100 vh-100 vstack align-items-center justify-content-between"}>
      {isLoading && (
        <div className="loading-overlay position-absolute top-50 start-50 translate-middle bg-glass">
          Loading...
        </div>
      )}
      {isDeleting && (
        <div className="loading-overlay position-absolute top-50 start-50 translate-middle bg-glass">
          Deleting...
        </div>
      )}
      <h2>Announcements</h2>
      {isLoading == false && items.length == 0 ? (
        <div className="no-items">No items</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <div
                className="vstack itemList gap-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={"item-" + index + ".."}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="item-single hstack justify-content-evenly align-items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="content-thumb">
                          {item?.metadata?.contentType.startsWith("image") ? (
                            <img
                              className="pe-none"
                              src={item.url}
                              alt={`Image ${index}`}
                              style={{ width: "100px" }}
                            />
                          ) : item?.metadata?.contentType.startsWith(
                              "video"
                            ) ? (
                            <video
                              className="pe-none"
                              autoPlay={true}
                              src={item.url}
                              style={{ width: "100px" }}
                            />
                          ) : (
                            <div
                              className="pe-none text-center d-flex flex-column  justify-content-center align-items-center rounded-4"
                              style={{
                                width: "125px",
                                height: "125px",
                                background: "#4567",
                              }}
                            >
                              Unsupported Format
                              <span style={{ fontSize: "10px" }}>
                                {item.metadata.contentType}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="vstack details">
                          <div className="name item-detail">
                            {item.metadata.name}
                          </div>

                          <div className="fullPath item-detail">
                            {item.metadata.fullPath}
                          </div>

                          <div className="size item-detail">
                            <Bytes value={Number(item.metadata.size)} />
                          </div>
                          <div className="time item-detail">
                            uploaded at: {item.metadata.timeCreated}
                          </div>
                          <div className="type item-detail">
                            type:{item.metadata.contentType}
                          </div>
                        </div>
                        <div className="actions">
                          <button
                            className="btn border-0"
                            onClick={() => {
                              deleteStorageItem(item.metadata.fullPath);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="center ">
        <Link to="/announce/" className="btn btn-primary rounded-3 m-2 d-center border-0" style={{ width: "4em" ,height: "4em"}}>
          <FaPlus fontSize={"1.5em"}/>
        </Link>
      </div>
    </div>
  );
}

export default Announcements;
