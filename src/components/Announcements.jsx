// Announcements.js
import React, {
  useState,
  useEffect,
  useMemo,
  useTransition,
  useContext,
} from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { UserContext, auth, refStorage, storage } from "../utils/firebase";
import { FaExternalLinkAlt, FaPlus, FaRedo, FaTrash } from "react-icons/fa";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
} from "firebase/storage";
import Bytes from "../utils/Bytes"; // Import the Bytes component
import { Link, useActionData, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import RandomQuote from "../utils/RandomQuote";
import axios from "axios";
function Announcements() {
  const [items, setItems] = useState([]);
  const [urlMap, setURLMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refresh, setRefresh] = useState(); 
  const [quote, setQuote] = useState(null);

  ///////
  useEffect(() => {
    axios.get("https://api.quotable.io/random").then((res) => {
      setQuote(res.data);
    });
  }, [refresh]);
  ///////
  const navigate = useNavigate();
  const user = useContext(UserContext);
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
  }, [refresh]);

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
          prevItems.filter((item) => item?.metadata.fullPath !== fullPath)
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }
  function handleSignOut() {
    auth.signOut().then(() => {
      navigate("/login");
    });
  }
  return (
    <div
      className={
        isDeleting || isLoading
          ? "loading pe-none vw-100 vh-100 vstack align-items-center justify-content-between "
          : "vw-100 vh-100 vstack align-items-center justify-content-between "
      }
    >
      {isLoading && (
        <>
          <div className="loading-overlay position-absolute top-50 start-50 vh-100 vw-100 text-white translate-middle bg-glass d-center ">
            <div>Loading...</div>
          </div>
          <div className="loading-overlay mb-5 position-absolute d-center bottom-0 ">
            <RandomQuote quote={quote} />
          </div>
        </>
      )}
      {isDeleting && (
        <div className="loading-overlay position-absolute top-50 start-50 vh-100 vw-100 text-white translate-middle bg-glass  d-center ">
          <div>Deleting...</div>
        </div>
      )}
      <div className="d-flex flex-column w-100 justify-content-between  p-3 bg-dark text-white ">
        <div className="hstack justify-content-between p-3">
          <h2 className="d-inline">Announcements</h2>
          <button
            className="btn  text-white"
            onClick={() => setRefresh(Math.random())}
          >
            <FaRedo />
          </button>
          <div className="hstack gap-2  ">
            <Link to="/announce" className="text-white">
              Announce
            </Link>
            <Link to="/display" className="text-white">
              Display
            </Link>
          </div>
        </div>
        <div className="hstack justify-content-between px-5">
          <span>signed in as {user?.email}</span>
          <button
            className="link btn text-primary "
            onClick={() => handleSignOut()}
          >
            signout
          </button>
        </div>
      </div>

      {isLoading == false && items.length == 0 ? (
        <div className="no-items w-100 d-center h-100 ">No items</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <div
                className="vstack itemList gap-2  text-white bg-dark"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Container fluid>
                  {items.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={"item-" + index + ".."}
                      index={index}
                    >
                      {(provided) => (
                        <Row
                          className="item-single d-flex justify-content-between align-items-center w-100 px-4 gap-3 mb-4"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Col className="content-thumb flex-grow-0 ">
                            {item?.metadata?.contentType.startsWith("image") ? (
                              <img
                                className="pe-none"
                                src={item.url}
                                alt={`Image ${index}`}
                                style={{ width: "150px" }}
                              />
                            ) : item?.metadata?.contentType.startsWith(
                                "video"
                              ) ? (
                              <video
                                controls={true}
                                autoPlay={false}
                                src={item.url}
                                style={{ width: "150px" }}
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
                                  {item?.metadata?.contentType}
                                </span>
                              </div>
                            )}
                          </Col>
                          <Col className="flex-grow-0">
                            <Link
                              target="_blank"
                              to={item?.url}
                              className="h-100 d-center"
                            >
                              <FaExternalLinkAlt />
                            </Link>
                          </Col>
                          <Col className="flex-grow-1">
                            <Container className="details">
                              <Row>
                                <Col className="text-secondary flex-grow-0">
                                  Name
                                </Col>
                                <Col className="name item-detail text-white  flex-wrap flex-grow-1 align-self-end d-flex  justify-content-end">
                                  {item?.metadata.name}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="text-secondary flex-grow-0">
                                  Path
                                </Col>
                                <Col className="fullPath item-de text-white tail flex-wrap flex-grow-1 align-self-end d-flex  justify-content-end">
                                  {item?.metadata.fullPath}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="text-secondary flex-grow-0">
                                  size
                                </Col>{" "}
                                <Col className="size item-detail text-white  flex-wrap flex-grow-1 align-self-end d-flex  justify-content-end">
                                  <Bytes value={Number(item?.metadata.size)} />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="text-secondary flex-grow-0 text-nowrap">
                                  Created at
                                </Col>{" "}
                                <Col className="time item-detail text-white  flex-wrap flex-grow-1 align-self-end d-flex  justify-content-end">
                                  {item?.metadata.timeCreated}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="text-secondary flex-grow-0">
                                  type
                                </Col>
                                <Col className="type item-detail text-white  flex-wrap flex-grow-1 align-self-end d-flex  justify-content-end">
                                  {item?.metadata.contentType}
                                </Col>
                              </Row>
                            </Container>
                          </Col>
                          <Col className="flex-grow-0">
                            <div className="actions">
                              <button
                                className="btn border-0 text-danger p-3  bg-secondary"
                                onClick={() => {
                                  deleteStorageItem(item?.metadata.fullPath);
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </Draggable>
                  ))}
                </Container>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="d-center bg-dark text-white w-100">
        <Link
          to="/announce/"
          className="btn btn-primary rounded-3 m-2 d-center border-0"
          style={{ width: "4em", height: "4em" }}
        >
          <FaPlus fontSize={"1.5em"} />
        </Link>
      </div>
    </div>
  );
}

export default Announcements;
