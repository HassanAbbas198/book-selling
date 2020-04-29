// const fs = require("fs");
// const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");

exports.createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    imagePath: url + "/images/" + req.file.filename,
    // userData is the field we added in the check-auth file
    creator: req.userData.userId,
  });
  try {
    // saving the new post using the mongoose .save()
    const createdPost = await post.save();

    // returs a JSON object
    res.status(201).json({
      message: "Post added succesfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        price: createdPost.price,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Creation failed!",
    });
  }
};

exports.getPosts = async (req, res, next) => {
  // we receive it as string, we can add + so it will be converted to a number
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  // Post.find() return the documents of the Post model
  const postQuery = Post.find().sort({ createdAt: -1 }).populate("creator");
  // url : http://localhost:3000/api/posts?pagesize=3&page=1
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  try {
    const fetchedPosts = await postQuery;
    const count = await Post.count();

    res.status(200).json({
      message: "Data fetched succesfully",
      posts: fetchedPosts,
      maxPosts: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't fetch data",
    });
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      _id: post._id,
      title: post.title,
      content: post.content,
      price: post.price,
      imagePath: post.imagePath,
      creatorId: post.creator._id,
      creatorName: post.creator.name,
      date: new Date(post.createdAt).toLocaleDateString("en-US"),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch a post!",
    });
  }
};

exports.updatePost = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    price: req.body.price,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  try {
    const result = await Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    );
    if (result.n > 0) {
      res.status(200).json({
        message: "Post updated successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't update post",
    });
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    // const post = await Post.findById(postId);
    // clearImage("http://localhost:3000/images/aaa-1586637928505.jpg");
    const result = await Post.deleteOne({
      _id: postId,
      creator: req.userData.userId,
    });
    if (result.n > 0) {
      res.status(200).json({
        message: "Post Deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't delete post",
    });
  }
};

exports.addToFavorite = async (req, res, next) => {
  const postId = req.params.id;
  const isFavorite = req.body.isFavorite;
  const userId = req.userData.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    let updatedFavPosts = [...user.favPosts];

    const postIndex = updatedFavPosts.findIndex(
      (fp) => fp.toString() === post._id.toString()
    );

    if (postIndex < 0 && isFavorite) {
      updatedFavPosts.push(post);
      user.favPosts = updatedFavPosts;
      await user.save();
      res.status(200).json({
        message: "Added to favorites",
        isFav: true,
      });
    } else if (postIndex >= 0 && !isFavorite) {
      updatedFavPosts = user.favPosts.filter((p) => {
        return p.toString() !== postId.toString();
      });
      user.favPosts = updatedFavPosts;
      await user.save();
      res.status(200).json({
        message: "Removed from favorites",
        isFav: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't add to favorites",
    });
  }
};

// const clearImage = (filePath) => {
//   filePath = path.join(__dirname, "..", filePath);
//   fs.unlink(filePath, (err) => console.log(err));
// };
