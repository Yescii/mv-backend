///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 4000
// pull MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const MountainsSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  location: String,
});

const Mountains = mongoose.model("Mountains", MountainsSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("server works");
});

// INDEX ROUTE
app.get("/mountains", async (req, res) => {
  try {
    // send all mouatians Data
    res.json(await Mountains.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// CREATE ROUTE
app.post("/mountains", async (req, res) => {
  try {
    // create data
    res.json(await Mountains.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// CREATE ROUTE
app.delete("/:id", (req, res) => {
  Mountains.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/mountains");
  });
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
