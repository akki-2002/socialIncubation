import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost, addComment, getComments } from "../../api/PostsRequests";
import { getUser } from "../../api/UserRequests";
import { useSelector } from "react-redux";
import { MdEmojiEmotions } from "react-icons/md";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [postUser, setPostUser] = useState({});
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(2);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser(data.userId);
      setPostUser(response.data);
    };
    fetchUser();
  }, [data.userId]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await getComments(data._id);
      setComments(response.data.reverse());
    };
    fetchComments();
  }, [data._id]);

  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${data._id}`;
    if (navigator.share) {
      navigator.share({
        title: `Post by ${postUser.firstname} ${postUser.lastname}`,
        text: data.desc,
        url: postUrl,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported in this browser');
    }
  };

  const handleComment = async () => {
    const newComment = {
      userId: user._id,
      username: user.username,
      text: commentText,
    };
    const response = await addComment(data._id, newComment);
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const loadMoreComments = () => {
    setCommentsToShow(comments.length);
  };


  if (!data || !Array.isArray(data.hashtags)) {
    return null; // or return a fallback UI
  }

  return (
    <div className="Post">
      <div className="postUser">
        <div>
          <b>
            <div className="postUserName">
              {postUser.firstname} {postUser.lastname}
            </div>
          </b>
          <span className="postUserHandle">@{postUser.username}</span>
        </div>
      </div>
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="" style={{ cursor: "pointer" }} onClick={toggleComments} />
        <img src={Share} alt="" style={{ cursor: "pointer" }} onClick={handleShare} />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div className="detail">
        <p>{data.desc}</p> 
        <div className="hashtags">
  {data.hashtags && data.hashtags.map((hashtag, index) => (
    <span key={index} className="hashtag">
      #{hashtag}
    </span>
  ))}
</div>

      </div>

      {showComments && (
        <>
          <div className="commentsSection">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              
            />
            <button className="button ps-button" onClick={handleComment}>Comment</button>
          </div>

          <div className="commentsList">
            {comments.slice(0, commentsToShow).map((comment, index) => (
              <div key={index} className="comment">
                <b>@{comment.username}:</b> {comment.text}
              </div>
            ))}
            {comments.length > commentsToShow && (
              <div className="viewMoreComments" onClick={loadMoreComments}>
                View More Comments
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
