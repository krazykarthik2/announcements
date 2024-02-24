// Announcements.js
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { refStorage, storage } from "../utils/firebase";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
} from "firebase/storage";
function Announcements() {
  const [items, setItems] = useState([]);
  const [urlMap, setURLMap] = useState(new Map());
  window.items = items;
  useEffect(() => {
    // Fetch items from Firebase Storage
    const storageRef = refStorage(storage, "/announcements/");
    console.log(storageRef);
    console.log(refStorage);
    window.storageRef = storageRef;
    listAll(storageRef).then((result) => {
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
            prevMap.set(itemRef.fullPath, {
              url: prevMap.get(itemRef.fullPath).url,
             
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
            return prevMap;
          });
        });
        getDownloadURL(itemRef).then((url) => {
          setURLMap((prevMap) => {
            console.log(prevMap);
            prevMap.set(itemRef.fullPath, {
              metadata: prevMap.get(itemRef.fullPath).metadata,
              url: url,
            });
            return prevMap;
          });
        });
      });
    });
  }, []);
  useEffect(() => {
    setItems([...urlMap.values()]);
  }, [urlMap]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <div>
      <h2>Announcements</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={"item-" + index + ".."}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.type == "img" && (
                        <img
                          src={item.url}
                          alt={`Image ${index}`}
                          style={{ width: "100px" }}
                        />
                      )}
                      {item.type == "video" && (
                        <video src={item.url} style={{ width: "100px" }} />
                      )}
                      {item.title}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Announcements;
