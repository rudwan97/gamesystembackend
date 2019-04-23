// Zorg dat we duidelijk kunnen zien wie de applicaties gemaakt heeft. Zet dus je naam en
// studentnummer in je code:
//Gemaakt door Rudwan Akhiat, 2130818
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const developersRoutes = require("./routes/developers");
const gamesRoutes = require("./routes/games");
const characterRoutes = require("./routes/characters");

const app = express();

mongoose
  .connect(
    "mongodb+srv://rudwan:"+
    process.env.MONGO_PASS
    + "@cluster0-lh7vg.mongodb.net/test?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use("/api/user", userRoutes);
app.use("/api/developers", developersRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/characters", characterRoutes);
module.exports = app;
