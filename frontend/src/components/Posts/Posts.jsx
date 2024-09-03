import React, { useEffect, useState } from "react";
import { getTimelinePosts } from "../../actions/PostsAction";
import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import "./Posts.css";
import { useParams } from "react-router-dom";

const Posts = ({hashId}) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);
  const [allPosts, setAllPosts] = useState([])

 useEffect(() => {
    if (hashId) {
      const fetchData = async () => {
        const response = await fetch(`http://localhost:5000/post/timeline`);
        const json = await response.json();
        if (response.ok) {
          const filteredPosts = json.filter((post) => post.hashtags.includes(hashId));
          setAllPosts(filteredPosts);
        }
      };
      fetchData();
    } else {
      const fetchData = async () => {
        const response = await fetch(`http://localhost:5000/post/timeline`);
        const json = await response.json();
        if (response.ok) {
          setAllPosts(json);
        }
      };
      fetchData();
    }
  }, [dispatch, hashId, posts]);

  useEffect(() => {
    setAllPosts(posts);
    console.log("Posts received:", posts);
  }, [posts]);

  

  if (!posts) return "No Posts";

  return (
    <div className="Posts">
      {loading
        ? "Fetching posts...."
        : allPosts?.map((post, id) => {
            return <Post data={post} key={id} />;
          })}
    </div>
  );
};

export default Posts;