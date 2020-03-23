const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const cors = require("cors");
// app.use(cors());

const Post = require("./models/post");
const app = express();

app.use(bodyParser.json());

//conmecting to mongoDB
mongoose
  .connect(
    "mongodb+srv://Hassan:sjtaYzzb9qrNTTnu@cluster0-hgg0a.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to Database");
  })
  .catch(() => {
    console.log("failed!");
  });

//fixing the CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//adding a new post
app.post("/api/posts", (req, res, next) => {
  // creating an instance 'post' of the Post schema
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // saving the new post using the mongoose .save()
  post.save().then(createdPost => {
    // returning a JSON object
    res.status(201).json({
      message: "Post added succesfully",
      postId: createdPost._id
    });
  });
});

//getting all posts
app.get("/api/posts", (req, res, next) => {
  //Post.find() return the documents of the Post model
  Post.find().then(documents => {
    res.status(200).json({
      message: "Data fetched succesfully",
      posts: documents
    });
  });
});

//delete selected post
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({
      message: "Post deleted succesfully"
    });
  });
});

//exporting the app
module.exports = app;
