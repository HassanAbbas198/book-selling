const mongoose = require("mongoose");

const entitySchema = mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  governorate: { type: String, required: true },
});

module.exports = mongoose.model("Entity", entitySchema);
