const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const cors = require("cors");
// app.use(cors());
const app = express();

app.use(bodyParser.json());

const postsRoutes = require("./routes/posts");

//conmecting to mongoDB
mongoose
  .connect(
    "mongodb+srv://Hassan:sjtaYzzb9qrNTTnu@cluster0-hgg0a.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Failed!");
  });

//fixing the CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//redirecting everything with /api/posts path to the routes/posts folder
app.use("/api/posts", postsRoutes);

//exporting the app
module.exports = app;
