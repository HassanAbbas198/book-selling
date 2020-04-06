const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

// conmecting to mongoDB
mongoose
  .connect(
    "mongodb+srv://Hassan:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-hgg0a.mongodb.net/node-angular?retryWrites=true&w=majority"
  )

  // mongodb+srv://Hassan:sjtaYzzb9qrNTTnu@cluster0-hgg0a.mongodb.net/node-angular?retryWrites=true&w=majority

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
