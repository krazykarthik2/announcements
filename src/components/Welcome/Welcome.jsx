// Welcome.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "./index.css"; // Import your CSS file for styling
import { auth } from "../../utils/firebase";

function Welcome() {
  const [user, setUser] = React.useState(auth?.currentUser);
  useMemo(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  },[])
  return (
    <div className="welcome-container">
      <h1>Welcome to Your App</h1>
      <div className="links-container">
        {auth.currentUser ? (
          <div className="loggedin vstack">
            <Link to="/announcements" className="page-link">
              Announcements
            </Link>

            <button className="btn border-0" onClick={() => auth.signOut()}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="page-link">
            Login
          </Link>
        )}
        <Link to="/display" className="page-link">
          Display
        </Link>
        {/* Add more links as needed */}
      </div>
    </div>
  );
}

export default Welcome;
