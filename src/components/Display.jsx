// Display.js
import React, { useEffect, useState } from 'react';
import { ref as refStorage } from 'firebase/storage';
function Display() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const storageRef = refStorage();
    storageRef.listAll().then((result) => {
      result.items.forEach((imageRef) => {
        imageRef.getDownloadURL().then((url) => {
          setImages((prevImages) => [...prevImages, url]);
        });
      });
    });
  }, []);

  return (
    <div>
      <h2>Display</h2>
      <div className="carousel">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index}`} />
        ))}
      </div>
    </div>
  );
}

export default Display;
