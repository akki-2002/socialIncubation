// Routes/PostRoutes.js

import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost, addComment, getComments, getTrendingHashtags } from "../Controllers/PostController.js";
const router = express.Router();


router.get("/trendingHashtags", getTrendingHashtags);

router.get("/timeline", getTimelinePosts);

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);

router.post("/:id/comment", addComment);
router.get("/:id/comments", getComments);


  
  



export default router;

