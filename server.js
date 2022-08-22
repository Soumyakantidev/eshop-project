/**
 * This should be the starting pint of the application
 */
const express = require("express");

const app = express();
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const mongoose = require("mongoose");

/**
 * I need to connect to the database
 */
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
  console.log("error while connecting to DB");
});

db.once("open", () => {
  console.log("Connected to database");
});

app.listen(serverConfig.PORT, () => {
  console.log("Server started on the port no :", serverConfig.PORT);
});
