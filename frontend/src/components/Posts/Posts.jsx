import React, { useEffect } from "react";
import { getTimelinePosts } from "../../actions/PostsAction";
import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import "./Posts.css";
import { useParams } from "react-router-dom";

const Posts = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (params.hashtag) {
      console.log("Fetching posts with hashtag:", params.hashtag);
      dispatch(getTimelinePosts({ hashtag: params.hashtag }));
    } else {
      console.log("Fetching all timeline posts");
      dispatch(getTimelinePosts());
    }
  }, [dispatch, params.hashtag]);

  console.log("Posts received:", posts);

  if (!posts) return "No Posts";

  return (
    <div className="Posts">
      {loading
        ? "Fetching posts...."
        : posts.map((post, id) => {
            return <Post data={post} key={id} />;
          })}
    </div>
  );
};


export default Posts;
