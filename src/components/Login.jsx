// Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  Floating_Control_Label,
  Floating_Password_Label,
} from "../utils/FormComp";
import { Button, Card, Form } from "react-bootstrap";
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
        console.log(error);
        setError(error);
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin();
  }
  return (
    <div className="sign vh-100 vw-100 d-flex align-items-center justify-content-center">
      <Card
        className=" align-items-stretch h-fit-content w-100"
        style={{ maxWidth: "600px" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit} className="vstack gap-3">
            <Floating_Control_Label
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />

            <Floating_Password_Label
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
            />
            {error && error.code === "auth/invalid-credentials" && (
              <p className="text-danger">Invalid email or password</p>
            )}
            <Button className="">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
