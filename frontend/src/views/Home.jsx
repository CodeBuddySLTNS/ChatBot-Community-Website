import { useEffect, useContext } from "react";
import { ContextData } from "../App";
import { useQuery, useMutation } from "@tanstack/react-query";
import Axios from "../utils/Axios";

import defaultProfile from "../assets/defaultProfile.png";
import Logo from "../assets/logo.jpg";

// components
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { DisplayAnnouncements } from "../components/DisplayAnnouncements";

const Home = () => {
  const { setActive } = useContext(ContextData);

  const fetchAnnouncements = async () => {
    const response = await Axios.get("/api/homepage");
    return response.data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements
  });

  useEffect(() => {
    setActive({ announce: true });
  }, []);

  if (isLoading)
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

  if (error)
    return (
      <div className="errorContainer">
        <div className="errorBox">
          <p> Failed to load announcements.</p>
          <button onClick={refetch}>Retry</button>
        </div>
      </div>
    );

  return (
    <div className="container">
      <h2 className="h2">📢 Announcements</h2>
      <div className="contents">
        {data?.response?.length === 0 && (
          <p style={{ textAlign: "center" }}>No data.</p>
        )}
        <div className="announceCards">
          <DisplayAnnouncements
            announcements={data?.response}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
