const mongoose = require("mongoose");

// initializing a schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

//exporting it. so I can use it in 'app.js' with **Post** model
module.exports = mongoose.model("Post", postSchema);
