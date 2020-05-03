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
  const newEntry = new SensorData({
    engineId,
    massFlow,
    dieselFlow,
    nox,
    temperature,
    efficiency
  });
  newEntry
    .save()
    .then(user => res.json(user))
    .catch(err => console.log("DB Error : " + err));
});

app.post("/view", (req, res) => {
  var engineId = req.body.engineId;
  console.log(engineId);
  SensorData.find({ engineId })
    .sort({ date: -1 }) //was date: -1
    .then(data => {
      if (data && data.length > 0) {
        var respArray = [];
        data.forEach(elem => {
          respArray.push({ elem: elem, date: elem._id.getTimestamp() });
        });
        res.json(respArray);
      } else {
        res.json({ idErr: "Id is not added" });
      }
    })
    .catch(err => console.log("Error : " + err));
});

app.post("/viewAll", (req, res) => {
  var engineId = req.body.engineId;
  console.log(engineId);
  SensorData
  .aggregate(
    [      
        { "$sort": { "engineId": 1, "date": -1 } }, 
        { "$group": {                                           //sorting and grouping to bring latest data for each engineId
            "_id": "$engineId",
            "engineId":{ "$last": "$engineId"},
            "dieselFlow": { "$last": "$dieselFlow" },
            "massFlow": { "$last": "$massFlow" },
            "nox": { "$last": "$nox" },
            "temperature": { "$last": "$temperature" },
            "efficiency": { "$last": "$efficiency" },
        }},
        { "$match": { "efficiency": {"$lt":"80" } , "nox": {"$gt":"65"} }}, //change critical value here. $gt - greater than, $gte - greater than and equal to
    ],
    function(err,result) {
      if (err) {
        console.log(err);
        return;
    }
    console.log(result);
    }
)
    .then(data => {
      if (data && data.length > 0) {
        var respArray = [];
        data.forEach(elem => {
          respArray.push({ elem: elem}); //removed date: elem._id.getTimestamp() temporarily
        });
        res.json(respArray);
      } else {
        res.json({ idErr: "Id is not added" });
      }
    })
    .catch(err => console.log("Error : " + err));
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
