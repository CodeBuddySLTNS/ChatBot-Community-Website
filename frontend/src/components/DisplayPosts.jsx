import { useState, useRef, useEffect, useContext } from "react";
import { ContextData } from "../App";
import { usePost } from "../hooks/Requests";
import DisplayDate from "../utils/DisplayDate";

import {
  FaThumbsUp,
  FaRegThumbsUp,
  FaRegComment,
  FaLink,
  FaImages,
  FaPaperPlane,
  FaPlusCircle,
  FaCheck
} from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { RxDotsHorizontal } from "react-icons/rx";
import { Link } from "react-router-dom";

import defaultProfile from "../assets/defaultProfile.png";

const DisplayPosts = ({ posts, retry }) => {
  const { userData } = useContext(ContextData);
  const { loading, data, error, postData } = usePost("/api/posts/likepost");
  const [current, setCurrent] = useState(posts);
  const [postId, setPostId] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [copiedLink, setLink] = useState(null);

  const handleLike = id => {
    postData({ postId: id });
    setPostId(id);
  };

  const handleCopyLink = id => {
    const link = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(link);
    setLink(id);
  };

  useEffect(() => {
    if (data) {
      const d = data.response;
      let newdata = new Array();
      for (let a of current) {
        a._id === d._id ? newdata.push(d) : newdata.push(a);
      }
      setCurrent(newdata);
    }

    if (error) {
      if (error.authError) {
        setAuthError(true);
        setTimeout(function () {
          setAuthError(false);
        }, 7000);
      }
    }
  }, [data, error]);

  return (
    <>
      <div
        className="popupBox"
        style={{
          height: authError && "75px",
          border: authError && "1px solid var(--primary)"
        }}
      >
        <div className="boxContents">
          You need to be logged in to do this action...
        </div>
      </div>
      <div className="posts">
        <h2>
          <Link to="/addpost">
            <FaPlusCircle className="newpostIcon" />
          </Link>
          📰 Newsfeed
          <BiRefresh className="refreshBtn" onClick={() => retry()} />
        </h2>
        {current?.map((post, id) => (
          <div className="post" key={id}>
            <div className="postContent">
              <div className="postHeader">
                <div className="author">
                  <div
                    className="img"
                    style={{
                      backgroundImage: post.author.img
                        ? `url("${post.author.img}")`
                        : `url("${defaultProfile}")`
                    }}
                  ></div>
                  <div className="info">
                    <p>{post.author.name}</p>
                    <span>
                      {post.author.role} • {DisplayDate(post.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="postSettings">
                  <RxDotsHorizontal className="icon" />
                </div>
              </div>
              <div className="postBody">
                <pre>{post.message}</pre>
              </div>
              <div className="postAction">
                <li onClick={() => handleLike(post._id)}>
                  {loading && postId === post._id ? (
                    <>...</>
                  ) : (
                    <>
                      {post.whoLiked.includes(userData?._id) ? (
                        <FaThumbsUp className="icon" />
                      ) : (
                        <FaRegThumbsUp className="icon" />
                      )}
                      <span>{post.likes}</span>
                    </>
                  )}
                </li>
                <li className="commentsBtn">
                  <Link to={`/post/${post._id}`}>
                    <FaRegComment className="icon" />
                    <span>{post.comments.length}</span>
                  </Link>
                </li>
                <li onClick={() => handleCopyLink(post._id)}>
                  {copiedLink === post._id ? (
                    <FaCheck className="icon linkIcon" />
                  ) : (
                    <FaLink className="icon linkIcon" />
                  )}
                </li>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DisplayPosts;
