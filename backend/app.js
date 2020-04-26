// const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
// const morgan = require("morgan");

const app = express();

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   {
//     flags: "a",
//   }
//   );
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(helmet());
app.use(compression());

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

// mongodb+srv://hassan:tM75CuxFCBvDKQqA@cluster0-kvm6f.mongodb.net/test?retryWrites=true&w=majority
// conmecting to mongoDB
mongoose
  .connect(
    "mongodb+srv://hassan:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-kvm6f.mongodb.net/book-selling?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Failed!");
  });

// fixing the CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// redirecting everything with /api/posts path to the routes/posts folder
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

// exporting the app so we can use it to create server in server.js
module.exports = app;
