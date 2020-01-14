const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const SensorData = require("./models/SensorData");
var isConnected = false;

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
    isConnected = true;
    console.log("DB connected successfully");
  })
  .catch(err => console.log("Error : " + err));

app.get("/", (req, res) => {
  // show sensor data
  res.render("index");
});

app.post("/send", (req, res) => {
  // add data to cloud
  var engineId = req.body.engineid; 
  var massFlow = req.body.massflow; 
  var dieselFlow = req.body.dieselflow; 
  var nox = req.body.nox; 
  var temperature = req.body.temp; 
  var efficiency = req.body.efficiency; 
  SensorData.findOne({ engineId })
    .then(user => {
      if (user) {
        // change status code
        res.json({ idErr: "Id is already added" });
      } else {
        const newEntry = new SensorData({
          engineId, massFlow, dieselFlow, nox, temperature, efficiency
        });
        newEntry
          .save()
          .then(user => res.json(user))
          .catch(err => console.log("DB Error : " + err));
      }
    })
    .catch(err => console.log("Error : " + err));
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
