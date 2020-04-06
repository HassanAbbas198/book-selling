const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const fileExtract = require("../middleware/file");

const PostsController = require("../controllers/posts");

//routes have been filtered by '/api/posts' before reachinng this

//adding a new post
router.post("", checkAuth, fileExtract, PostsController.createPost);

//getting all posts
router.get("", PostsController.getPosts);

//getting a single post
router.get("/:id", PostsController.getPost);

//editing a post
router.put("/:id", checkAuth, fileExtract, PostsController.updatePost);

//delete a selected post
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
