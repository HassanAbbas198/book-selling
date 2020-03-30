const Post = require("../models/post");

exports.createPost = (req, res, next) => {
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
  post
    .save()
    .then(createdPost => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Creation failed!"
      });
    });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't fetch data"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to fetch a post!"
      });
    });
};

exports.updatePost = (req, res, next) => {
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
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Post updated successfully"
        });
      } else {
        res.status(401).json({
          message: "Not authorized"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Post Deleted successfully"
        });
      } else {
        res.status(401).json({
          message: "Not authorized"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't delete post"
      });
    });
};
