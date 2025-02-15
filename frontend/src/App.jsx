import { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useFetch } from "./hooks/Requests";
import { useQuery } from "@tanstack/react-query";
import { useMainStore } from "./store";
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
  const userd = useMainStore(state => state);
  const setUser = useMainStore(state => state.setUser);
  const setViews = useMainStore(state => state.setViews);

  const contextValue = {
    active,
    setActive
  };

  const fetchUser = async () => {
    const url = config.production
      ? `${config.server}/user`
      : `${config.devServer}/user`;
    const response = await fetch(url);
    return response.json();
  };

  const fetchViews = async () => {
    const url = config.production
      ? `${config.server}/views`
      : `${config.devServer}/views`;
    const response = await fetch(url);
    return response.json();
  };

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser
  });

  const { data: viewscount } = useQuery({
    queryKey: ["views"],
    queryFn: fetchViews
  });

  useEffect(() => {
    if (user) setUser(user.response);
    if (viewscount) setViews(viewscount.response?.count);
  }, [user, viewscount]);

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
