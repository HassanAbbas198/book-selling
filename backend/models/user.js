const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// initializing a USER schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

userSchema.plugin(uniqueValidator);

//exporting it. so I can use it with **User** model
module.exports = mongoose.model("User", userSchema);
