import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../Post/Post";
import "./Posts.css";
import { useParams } from "react-router-dom";
import { getTimelinePosts } from "../../actions/PostsAction";

const Posts = ({ hashId }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    dispatch(getTimelinePosts(user._id)); // Fetch posts when component mounts
  }, [dispatch, user._id]);

  useEffect(() => {
    if (posts) {
      let filteredPosts = posts;

      // Filter by userId if specified in the URL params
      if (params.id) {
        filteredPosts = filteredPosts.filter((post) => post.userId === params.id);
      }

      // Further filter by hashtag if hashId is provided
      if (hashId) {
        filteredPosts = filteredPosts.filter((post) => post.hashtags.includes(hashId));
      }

      setAllPosts(filteredPosts);
    }
  }, [posts, params.id, hashId]);

  if (loading) return "Fetching posts....";
  if (!allPosts.length) return "No Posts";

  return (
    <div className="Posts">
      {allPosts.map((post, id) => (
        <Post data={post} key={id} />
      ))}
    </div>
  );
};

export default Posts;
