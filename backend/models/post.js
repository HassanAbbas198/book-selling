const mongoose = require("mongoose");

// initializing a schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

//exporting it. so I can use it with **Post** model
module.exports = mongoose.model("Post", postSchema);
