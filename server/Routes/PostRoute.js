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


router.get("/hashtag/:hashtag", async (req, res) => {
    const hashtag = req.params.hashtag;
  
    try {
      const posts = await PostModel.find({ hashtags: hashtag });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  



export default router;

