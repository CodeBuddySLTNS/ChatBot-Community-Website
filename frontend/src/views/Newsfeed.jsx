import { useEffect, useContext } from "react";
import { useFetch } from "../hooks/Requests";
import DisplayPosts from "../components/DisplayPosts";
import { ContextData } from "../App";

const Newsfeed = () => {
  const { setActive } = useContext(ContextData);
  const { loading, data, error, retry } = useFetch("/api/posts");

  useEffect(() => {
    setActive({ sites: true });
  }, []);

  if (loading)
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
          <button onClick={retry}>Retry</button>
        </div>
      </div>
    );

  return (
    <div className="container">
      <DisplayPosts posts={data?.response} retry={retry} />
    </div>
  );
};

export default Newsfeed;
