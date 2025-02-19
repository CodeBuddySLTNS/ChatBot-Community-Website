import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch, usePost } from "../hooks/Requests";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ContextData } from "../App";
import Axios from "../utils/Axios";
import DisplayDate from "../utils/DisplayDate";

import { BiRefresh } from "react-icons/bi";
import { RxDotsHorizontal } from "react-icons/rx";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegComment,
  FaLink,
  FaImages,
  FaPaperPlane,
  FaCheck
} from "react-icons/fa";

import defaultProfile from "../assets/defaultProfile.png";

const Post = () => {
  const { userData } = useContext(ContextData);
  const { id } = useParams();

  const fetchPostData = async () => {
    const response = await Axios.get(`/api/posts/?id=${id}`);
    return response.data;
  };

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["post"],
    queryFn: fetchPostData
  });

  const {
    loading: postloading,
    data: postdata,
    error: posterror,
    postData
  } = usePost(`/api/posts/addcomment`);

  const {
    loading: likeloading,
    data: likedata,
    error: likeerror,
    postData: likePost
  } = usePost(`/api/posts/likepost`);

  const [postInfo, setPostInfo] = useState(null);
  const [copiedLink, setLink] = useState(null);
  const [postId, setPostId] = useState(null);
  const [authError, setAuthError] = useState(null);
  const commentRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const handleLike = id => {
    likePost({ postId: id });
    setPostId(id);
  };

  const handleComment = () => {
    if (commentRef.current.value === "") return;
    const reqdata = {
      postId: data.response._id,
      message: commentRef?.current?.value?.trim()
    };
    postData(reqdata);
    commentRef.current.value = "";
  };

  const handleRefresh = () => {
    refetch();
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const div = scrollRef.current;
      div.scrollTop = div.scrollHeight;
    }
  };

  const handleCopyLink = id => {
    const link = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(link);
    setLink(id);
  };

  useEffect(() => {
    console.log(data);
    if (data?.success) {
      console.log(data);
      setPostInfo(data.response);
    }
    if (likedata?.success) {
      setPostInfo(likedata.response);
    }
    if (postdata?.success) {
      setPostInfo(postdata.response);
      setTimeout(function () {
        scrollToBottom();
      }, 300);
    }
  }, [data, postdata, likedata]);

  useEffect(() => {
    if (likeerror) {
      if (likeerror?.authError) {
        setAuthError(true);
        setTimeout(function () {
          setAuthError(false);
        }, 7000);
      }
    }
    if (posterror) {
      if (posterror?.authError) {
        setAuthError(true);
        setTimeout(function () {
          setAuthError(false);
        }, 7000);
      }
    }
  }, [likeerror, posterror]);

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
          <p> Failed to load post.</p>
          <button onClick={refetch}>Retry</button>
        </div>
      </div>
    );

  return (
    <div className="container">
      <div
        className="popupBox"
        style={{
          height: authError && "75px",
          border: authError && "1px solid var(--primary)",
          transition: "border 0.6s"
        }}
      >
        <div className="boxContents">
          You need to be logged in to do this action...
        </div>
      </div>
      <div className="post">
        <div className="postHeading">
          <div onClick={() => navigate(-1)}>{"< Back"}</div>
          <div></div>
          <BiRefresh className="icon" onClick={handleRefresh} />
        </div>
        <div className="postContent">
          <div className="postHeader">
            <div className="author">
              <div
                className="img"
                style={{
                  backgroundImage: postInfo?.author?.img
                    ? `url("${postInfo?.author?.img}")`
                    : `url("${defaultProfile}")`
                }}
              ></div>
              <div className="info">
                <p>{postInfo?.author?.name} </p>
                <span>
                  {postInfo?.author?.role} •
                  {postInfo?.date ? DisplayDate(postInfo?.date) : ""}
                </span>
              </div>
            </div>
            <div className="postSettings">
              <RxDotsHorizontal className="icon" />
            </div>
          </div>
          <div className="postBody">
            <pre>{postInfo?.message}</pre>
          </div>
          <div className="postAction">
            <li onClick={() => handleLike(postInfo?._id)}>
              {likeloading && postId === postInfo?._id ? (
                <>...</>
              ) : (
                <>
                  {postInfo?.whoLiked?.includes(userData?._id) ? (
                    <FaThumbsUp className="icon" />
                  ) : (
                    <FaRegThumbsUp className="icon" />
                  )}
                  <span>{postInfo?.likes}</span>
                </>
              )}
            </li>
            <li className="commentsBtn">
              <FaRegComment className="icon" />
              <span>{postInfo?.comments?.length}</span>
            </li>
            <li onClick={() => handleCopyLink(postInfo?._id)}>
              {copiedLink === postInfo?._id ? (
                <FaCheck className="icon linkIcon" />
              ) : (
                <FaLink className="icon linkIcon" />
              )}
            </li>
          </div>
          <div className="postComments">
            <div className="commentsHead">
              <p>Comments</p>
            </div>
            <div className="comments" ref={scrollRef}>
              {postInfo?.comments?.length == 0 ? (
                <p className="noComments">Be the first to comment.</p>
              ) : (
                postInfo?.comments?.map((comment, id) => (
                  <div className="comment" key={id}>
                    <div className="commentHead">
                      <div className="comAuthor">
                        <div
                          className="img"
                          style={{
                            backgroundImage: comment?.author?.img
                              ? `url("${comment.author.img}`
                              : `url("${defaultProfile}")`
                          }}
                        ></div>
                        <div className="info">
                          <p>{comment?.author?.name}</p>
                          <span>
                            {comment?.author?.role} •{" "}
                            {comment?.date ? DisplayDate(comment?.date) : ""}
                          </span>
                        </div>
                      </div>
                      <div className="comSettings">
                        <RxDotsHorizontal className="icon" />
                      </div>
                    </div>
                    <div className="commentBody">{comment?.message}</div>
                    <div className="commentAction">
                      <li>like</li>
                      <li>•</li>
                      <li>reply</li>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="commentInput">
              <div className="imgInput">
                <FaImages className="icon" />
              </div>
              <input
                type="text"
                ref={commentRef}
                placeholder="Write a message..."
              />
              <div
                className="send"
                onClick={handleComment}
                disabled={postloading}
                style={{ background: postloading && "var(--darkColor)" }}
              >
                <FaPaperPlane className="icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
