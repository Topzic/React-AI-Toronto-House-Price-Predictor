const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PredictionSchema = new Schema({
  prediction: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  parking: {
    type: Number,
    required: true,
  },
  houseType: {
    type: Number,
    required: true,
  },
});

// Create the 'Prediction' model out of the 'PredictionSchema'
module.exports = mongoose.model("Prediction", PredictionSchema);
