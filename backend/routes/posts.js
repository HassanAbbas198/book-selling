const express = require("express");
const multer = require("multer");
const router = express.Router();

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//routes have been filtered by '/api/posts' before reachinng this
//adding a new post
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    // creating an instance 'post' of the Post schema
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      //userData is the field we added in the check-auth file
      creator: req.userData.userId
    });
    // saving the new post using the mongoose .save()
    post.save().then(createdPost => {
      // returs a JSON object
      res.status(201).json({
        message: "Post added succesfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    });
  }
);

//getting all posts
router.get("", (req, res, next) => {
  //we receive it as string, we can add + so it will be converted to a number
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  //Post.find() return the documents of the Post model
  const postQuery = Post.find();
  // url : http://localhost:3000/api/posts?pagesize=3&page=1
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Data fetched succesfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

//getting a single post
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

//editing a post
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Post updated successfully"
        });
      } else {
        res.status(401).json({
          message: "Not authorized"
        });
      }
    });
  }
);

//delete a selected post
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Deletion successfully"
        });
      } else {
        res.status(401).json({
          message: "Not authorized"
        });
      }
    }
  );
});

module.exports = router;
