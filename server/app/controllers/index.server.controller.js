const fs = require("fs");
const { RandomForestRegression } = require("ml-random-forest");

// Function to load the trained model from the JSON file
function loadModel(modelFileName) {
  const modelJSON = fs.readFileSync(modelFileName);
  const modelData = JSON.parse(modelJSON);
  const model = RandomForestRegression.load(modelData);
  return model;
}

// Function to make predictions using the trained model
function makePrediction(model, data) {
  const prediction = model.predict(data);
  return prediction;
}

exports.predictHousePrice = function (req, res) {
  // Extract parameters from the request query
  const { bedrooms, bathrooms, sqft, parking, houseType } = req.query;

  // Log the extracted parameters
  // console.log("Extracted Parameters:");
  // console.log("Bedrooms:", bedrooms);
  // console.log("Bathrooms:", bathrooms);
  // console.log("Sqft:", sqft);
  // console.log("Parking:", parking);
  // console.log("House Type:", houseType);

  // Load the trained model
  console.log("Loading the trained model...");
  const modelFileName = "house_price_prediction_model.json";
  const model = loadModel(modelFileName);
  console.log("Model loaded successfully.");

  // Prepare input data for prediction
  const newData = [
    [
      parseFloat(bedrooms),
      parseFloat(bathrooms),
      parseFloat(sqft),
      parseFloat(parking),
      parseInt(houseType), // Assuming house type is provided as a number
    ],
  ];

  // Make prediction using the loaded model
  console.log("Making prediction...");
  const prediction = makePrediction(model, newData);
  console.log("Prediction:", prediction);

  var dataToSend = {
    prediction: prediction,
  };
  console.log(dataToSend);
  res.status(200).send(dataToSend);

  // Send the prediction as response
  // res.status(200).send({ prediction: prediction });
};
