const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// initializing a schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//exporting it. so I can use it with **User** model
module.exports = mongoose.model("User", userSchema);
