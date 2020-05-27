const mongoose = require("mongoose");

// mongodb+srv://hassan:tM75CuxFCBvDKQqA@cluster0-kvm6f.mongodb.net/test?retryWrites=true&w=majority

mongoose
  .connect(
    "mongodb+srv://hassan:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-kvm6f.mongodb.net/book-selling?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Failed!");
  });
