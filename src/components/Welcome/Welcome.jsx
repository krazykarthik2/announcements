// Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import your CSS file for styling

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Your App</h1>
      <div className="links-container">
        <Link to="/login" className="page-link">Login</Link>
        <Link to="/announce" className="page-link">Announce</Link>
        <Link to="/display" className="page-link">Display</Link>
        {/* Add more links as needed */}
      </div>
    </div>
  );
} 

export default Welcome;
