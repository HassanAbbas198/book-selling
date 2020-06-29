// const fs = require("fs");
const path = require("path");

require("./db/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");

const Entity = require("./models/entity");

const app = express();

app.use(helmet());
app.use(compression());

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "../images")));

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

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

// redirecting everything with /api/users path to the routes/users folder
app.use("/api/users", usersRoutes);

// creating a new educational entity
app.post("/api/entity", async (req, res, next) => {
  const newEntity = new Entity({
    name: req.body.name,
    city: req.body.city,
    governorate: req.body.governorate,
  });

  try {
    await newEntity.save();

    res.status(201).json({
      message: "Entity added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// getting all educational entities
app.get("/api/entities", async (req, res, next) => {
  try {
    const result = await Entity.find();
    const entities = result.map((e) => e.name);
    res.status(200).json(entities);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

// exporting the app so we can use it to create server in server.js
module.exports = app;
