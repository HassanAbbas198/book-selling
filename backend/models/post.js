const mongoose = require("mongoose");

// initializing a Post schema
const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// exporting it. so I can use it with **Post** model
module.exports = mongoose.model("Post", postSchema);
