const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Post = require("./post");

// initializing a USER schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  avatar: { type: String },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

userSchema.plugin(uniqueValidator);

/* virtual property isn't an actual data stored in the DB, its a relationship between 2 entities, we don't actually change what we store on the User document */
userSchema.virtual("myPosts", {
  ref: "Post",
  localField: "_id",
  foreignField: "creator",
});

// Cascade delete posts when User is deleted
userSchema.pre("remove", async function (next) {
  await Post.deleteMany({ creator: this._id });
  next();
});

// exporting the schema. so I can use it with **User** model
module.exports = mongoose.model("User", userSchema);
