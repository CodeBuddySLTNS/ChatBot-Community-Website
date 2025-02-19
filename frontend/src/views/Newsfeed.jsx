import { useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ContextData } from "../App";
import Axios from "../utils/Axios";
import DisplayPosts from "../components/DisplayPosts";

const Newsfeed = () => {
  const { setActive } = useContext(ContextData);

  const fetchPosts = async () => {
    const response = await Axios.get("/api/posts");
    return response.data;
  };

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  useEffect(() => {
    setActive({ sites: true });
  }, []);

  if (isLoading || isFetching)
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

  if (error)
    return (
      <div className="errorContainer">
        <div className="errorBox">
          <p> Failed to load posts.</p>
          <button onClick={refetch}>Retry</button>
        </div>
      </div>
    );

  return (
    <div className="container">
      <DisplayPosts posts={data?.response} retry={refetch} />
    </div>
  );
};

export default Newsfeed;
