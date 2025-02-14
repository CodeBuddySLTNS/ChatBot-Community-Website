import { useState, createContext, useEffect } from "react";
import { useFetch } from "./hooks/Requests";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import config from "../config.json";

// pages
import Home from "./views/Home";
import Websites from "./views/Websites";
import Apis from "./views/APIs";
import Pages from "./views/Pages";
import About from "./views/About";
import Login from "./views/Login";
import Signup from "./views/Signup";
import AddApi from "./views/AddApi";
import AddFbpage from "./views/AddFbpage";
import AddAnnounce from "./views/AddAnnounce";
import AddWebsite from "./views/AddWebsite";
import AdminPanel from "./views/AdminPanel";
import Newsfeed from "./views/Newsfeed";
import Post from "./views/Post";
import AddPost from "./views/AddPost";

// components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";

// context
export const ContextData = createContext();

function App() {
  const [active, setActive] = useState({});
  const [views, setViews] = useState(null);
  const [userData, setUserData] = useState(null);

  const contextValue = {
    active,
    setActive,
    views,
    setViews,
    userData,
    setUserData
  };

  const { data } = useFetch("/user");
  const { data: viewscount } = config.production ? useFetch("/views") : { data: null };

  useEffect(() => {
    if (data) setUserData(data.response);
    if (viewscount) setViews(viewscount?.response?.count);
  }, [data, viewscount]);

  return (
    <ContextData.Provider value={contextValue}>
      <main className="app">
        <Router>
          <Header />
          <Menu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/websites" element={<Websites />} />
            <Route path="/apis" element={<Apis />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/addannounce" element={<AddAnnounce />} />
            <Route path="/addapi" element={<AddApi />} />
            <Route path="/addfbpage" element={<AddFbpage />} />
            <Route path="/addwebsite" element={<AddWebsite />} />
            <Route path="/manage" element={<AdminPanel />} />
            <Route path="/feed" element={<Newsfeed />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/addpost" element={<AddPost />} />
          </Routes>
          <Navbar />
        </Router>
      </main>
    </ContextData.Provider>
  );
}

export default App;
