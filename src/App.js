// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Announce from "./components/Announce";
import Display from "./components/Display";
import Announcements from "./components/Announcements";
import Welcome from "./components/Welcome";
import { UserContext, auth } from "./utils/firebase";

function App() {
  const [user, setUser] = React.useState(auth?.currentUser);
  auth.onAuthStateChanged((user__)=>{
    setUser(user__);
  })
  return (
    <UserContext.Provider value={user}>
    <Router>
      <Routes>
        <Route path="" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="announce" element={<Announce />} />
        <Route path="display" element={<Display />} />
      </Routes>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
