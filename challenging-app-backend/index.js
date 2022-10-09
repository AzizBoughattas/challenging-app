const mongoose = require("mongoose");
const express = require("express");
const app = express();
const user = require("./routes/users");
const auth = require("./routes/auth");
const cors = require('cors')
require('dotenv').config({path:"./config/dev.env"})
mongoose
  .connect("mongodb://localhost/challenge-app")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors())

app.use("/api/users", user);
app.use("/api/auth", auth);



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
