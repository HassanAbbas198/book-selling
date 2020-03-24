const express = require("express");

const Post = require("../models/post");
const router = express.Router();

//routes have been filtered by '/api/posts' before reachinng this
//adding a new post
router.post("", (req, res, next) => {
  // creating an instance 'post' of the Post schema
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // saving the new post using the mongoose .save()
  post.save().then(createdPost => {
    // returs a JSON object
    res.status(201).json({
      message: "Post added succesfully",
      postId: createdPost._id
    });
  });
});

//getting all posts
router.get("", (req, res, next) => {
  //Post.find() return the documents of the Post model
  Post.find().then(documents => {
    res.status(200).json({
      message: "Data fetched succesfully",
      posts: documents
    });
  });
});

//getting a single post
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else res.status(404).json({ message: "post not found" });
  });
});

//editing a post
router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: "post updated successfully"
    });
  });
});

//delete a selected post
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({
      message: "Post deleted succesfully"
    });
  });
});

module.exports = router;
