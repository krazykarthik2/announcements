// Announce.js
import React, { useState } from "react";
import { ref as refStorage } from "firebase/storage";

function Announce() {
  const [file, setFile] = useState(null);
  const [currentSequence, setCurrentSequence] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = () => {
    const storageRef = refStorage();
    const newFileName = `${currentSequence + 1}_${file.name}`;
    const fileRef = storageRef.child(newFileName);
    fileRef.put(file).then(() => {
      console.log("File uploaded successfully!");
      setCurrentSequence(currentSequence + 1);
    });
  };

  return (
    <div>
      <h2>Announce</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}

export default Announce;
