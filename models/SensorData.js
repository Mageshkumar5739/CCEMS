const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
  engineId: {
    type: String,
    required: true
  },
  dieselFlow: {
    type: String,
    required: true
  },
  massFlow: {
    type: String,
    required: true
  },
  nox: {
    type: String,
    required: true
  },
  temperature: {
    type: String,
    required: true
  },
  efficiency: {
    type: String,
    required: true
  }
});

module.exports = sensorData = mongoose.model("sensorData", sensorDataSchema);
