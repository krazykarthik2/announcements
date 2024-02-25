// Announce.js
import React, { useContext, useEffect, useState } from "react";
import { UserContext, auth, refStorage, storage } from "../utils/firebase";
import { uploadBytesResumable } from "firebase/storage";
import { Form } from "react-bootstrap";
import { FaPaperclip, FaFile } from "react-icons/fa";
import { LuFileStack } from "react-icons/lu";
import { ProgressShow } from "../utils/ProgressShow";
import { Link, useNavigate } from "react-router-dom";
function Announce() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const user = useContext(UserContext);
  const navigate = useNavigate();
  window.progress = progress;
  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFile = () => {
    if (files.length === 0) {
      alert("Please select a file");
      return;
    }
    const storageRef = refStorage(storage, `/announcements/`);

    files.forEach((file) => {
      const newFileName = `slide-${Date.now()}-${Math.floor(
        Math.random() * 1000000
      )}`;
      const fileRef = refStorage(storageRef, newFileName);
      let uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((e) => ({ ...e, [file.name]: snapshot }));
        },
        (error) => {
          console.log(error);
        },
        () => {
          setProgress((e) => {
            return { ...e, [file.name]: null };
          });

          alert("File uploaded as " + newFileName + " successfully!");
          console.log("File uploaded successfully!");
        }
      );
    });
    setFiles([]);

    //uploadTask.pause();
    //uploadTask.resume();
    //uploadTask.cancel();
  };
  function handleSignOut() {
    auth.signOut().then(() => {
      navigate("/login");
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    uploadFile();
  }
  return (
    <div className="vw-100 vh-100 vstack align-items-center justify-content-between">
      <Form className="vstack w-100" onSubmit={handleSubmit}>
        <div className="d-flex flex-column justify-content-between  p-3 bg-dark text-white ">
          <div className="hstack justify-content-between p-3">
            <h2 className="d-inline">Announce</h2>
            <div className="hstack gap-2  ">
              <Link to="/announcements" className="text-white">
                Announcements
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

        <Form.Group controlId="formFile">
          <Form.Label>
            {files.length > 0 ? (
              <div className="hstack gap-3">
                {files.length < 2 ? (
                  <FaFile fontSize={38} />
                ) : (
                  <LuFileStack fontSize={100} />
                )}
                <div className="vstack">
                  {files.map((file, index) => (
                    <div key={index}>{file.name}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="btn btn-secondary d-center mx-4 my-5 p-3">
                <div className="hstack d-center gap-5 h3 m-0">
                  <FaPaperclip />
                  <span>Select a file</span>
                </div>
              </div>
            )}
          </Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleFileChange}
            hidden
          />
        </Form.Group>
        {files.length > 0 && (
          <button type="submit" className="btn btn-primary rounded-3">
            Upload
          </button>
        )}
      </Form>
      <div className="vw-100">
        <ProgressShow progress={progress} />
      </div>
    </div>
  );
}

export default Announce;
