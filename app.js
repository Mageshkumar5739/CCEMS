const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const url = require("./config/setup").mongoURL;

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//bodyparser middleware
app.use(bodyparser.urlencoded({ extended: false }));

//conecting to db
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch(err => console.log("Error : " + err));

app.get("/", (req, res) => {
  // show sensor data
  res.render("index");
});

app.post("/send", (req, res) => {
  // add data to cloud
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
