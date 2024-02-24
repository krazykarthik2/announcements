// Announce.js
import React, { useEffect, useState } from "react";
import { refStorage, storage } from "../utils/firebase";
import { uploadBytesResumable } from "firebase/storage";
import { Form } from "react-bootstrap";
import { FaPaperclip, FaFile } from "react-icons/fa";
import { LuFileStack } from "react-icons/lu";
import { ProgressShow } from "./ProgressShow";
function Announce() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
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
  function handleSubmit(e) {
    e.preventDefault();
    uploadFile();
  }
  return (
    <div className="vw-100 vh-100 vstack align-items-center justify-content-between">
      <Form className="vstack w-100" onSubmit={handleSubmit}>
        <h2>Announce</h2>
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
              <div className="btn btn-secondary mx-4 my-5">
                <div className="hstack">
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
          <button type="submit" className="btn btn-primary">
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
