// App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Announce from "./components/Announce";
import Announcements from "./components/Announcements";
import Display from "./components/Display";
import Login from "./components/Login";
import {
  RandomQuoteCont,
  QuotesByAuthor,
  Author,
  DisplayAuthors,
} from "./components/RandomQuoteCont";
import Welcome from "./components/Welcome";
import { UserContext, auth } from "./utils/firebase";
import SearchAuthors from "./components/RandomQuoteCont/SearchAuthors";
import AuthorRedirect from "./components/RandomQuoteCont/AuthorRedirect";
import SearchQuotes from "./components/RandomQuoteCont/SearchQuotes";
import QuotesByTag from "./components/RandomQuoteCont/QuotesByTag";

function App() {
  const [user, setUser] = React.useState(auth?.currentUser);
  auth.onAuthStateChanged((user__) => {
    setUser(user__);
  });
  return (
    <UserContext.Provider value={user}>
      <Router>
        <Routes>
          <Route path="" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="quote">
            <Route path=":id" element={<RandomQuoteCont />} />
            <Route path="" element={<RandomQuoteCont />} />
            <Route path="search" element={<SearchQuotes />} />
            <Route path="random" element={<RandomQuoteCont />} />
            <Route path="tags"  >
              <Route path="" element={<SearchQuotes />} />
              <Route path=":tag" element={<QuotesByTag />} />
            </Route>
            <Route path="authors">
              <Route path="" element={<DisplayAuthors />} />
              <Route path="search">
                <Route path="" element={<SearchAuthors />} />
              </Route>
            </Route>
            <Route path="author">
              <Route path="id/:author_id" element={<Author />} />
              <Route path=":author">
                <Route path="" element={<QuotesByAuthor />} />
                <Route path="about" element={<AuthorRedirect />} />
              </Route>
            </Route>
          </Route>
          <Route path="announcements" element={<Announcements />} />
          <Route path="announce" element={<Announce />} />
          <Route path="display" element={<Display />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
