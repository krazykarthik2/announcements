// App.js
import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Announce from "./components/Announce";
import Announcements from "./components/Announcements";
import Display from "./components/Display";
import Login from "./components/Login";
import {
  Author,
  DisplayAuthors,
  QuotesByAuthor,
  RandomQuoteCont,
} from "./components/RandomQuoteCont";
import { UserContext, auth } from "./utils/firebase";
const AuthorRedirect = lazy(()=>import("./components/RandomQuoteCont/AuthorRedirect"));
const QuotesByTag = lazy(()=>import("./components/RandomQuoteCont/QuotesByTag"));
const SearchAuthors = lazy(()=>import("./components/RandomQuoteCont/SearchAuthors"));
const SearchQuotes = lazy(()=>import("./components/RandomQuoteCont/SearchQuotes"));
const Welcome = lazy(()=>import("./components/Welcome"));
const Loading = lazy(()=>import("./utils/Loading"));


function App() {
  const [user, setUser] = React.useState(auth?.currentUser);
  auth.onAuthStateChanged((user__) => {
    setUser(user__);
  });
  return (
    <UserContext.Provider value={user}>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route path="" element={<Welcome />} />
            <Route path="login" element={<Login />} />
            <Route path="quote">
              <Route path=":id" element={<RandomQuoteCont />} />
              <Route path="" element={<RandomQuoteCont />} />
              <Route path="search" element={<SearchQuotes />} />
              <Route path="random" element={<RandomQuoteCont />} />
              <Route path="tags">
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
      </Suspense>
    </UserContext.Provider>
  );
}

export default App;
