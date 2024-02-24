// Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../utils/firebase";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Redirect or handle successful login
        console.log("User logged in successfully");
        setError(null);
        navigate("/announcements");
      })
      .catch((error) => {
        console.log(error)
        setError(error.message);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div>{error}</div>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
