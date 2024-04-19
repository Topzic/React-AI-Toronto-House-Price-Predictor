// Import required libraries
const fs = require("fs"); // Library for file system operations
const { RandomForestRegression } = require("ml-random-forest"); // Machine learning library for Random Forest Regression
const server = require("../../server.js"); // Server module

// Function to load the trained model from the JSON file
function loadModel(modelFileName) {
  const modelJSON = fs.readFileSync(modelFileName); // Read model data from JSON file
  const modelData = JSON.parse(modelJSON); // Parse model JSON data
  const model = RandomForestRegression.load(modelData); // Load model from parsed data
  return model; // Return loaded model
}

// Function to make predictions using the trained model
function makePrediction(model, data) {
  const prediction = model.predict(data); // Make prediction using the model
  return prediction; // Return prediction
}

// Exported function to predict house price
exports.predictHousePrice = function (req, res) {
  // Extract parameters from the request query
  const { bedrooms, bathrooms, sqft, parking, houseType, lat, long, email } =
    req.query;

  // Load the trained model
  console.log("Loading the trained model..."); // Log model loading start
  const modelFileName = "house_price_prediction_model.json"; // Path to trained model JSON file
  const model = loadModel(modelFileName); // Load the model from file
  console.log("Model loaded successfully."); // Log successful model loading

  // Prepare input data for prediction
  const newData = [
    [
      parseFloat(bedrooms), // Convert bedrooms to float
      parseFloat(bathrooms), // Convert bathrooms to float
      parseFloat(sqft), // Convert sqft to float
      parseFloat(parking), // Convert parking to float
      parseInt(houseType), // Parse houseType as integer
      parseFloat(lat), // Convert parking to float
      parseFloat(long), // Convert parking to float
    ],
  ];
  console.log(newData);
  // Make prediction using the loaded model
  console.log("Making prediction..."); // Log prediction making start
  const prediction = makePrediction(model, newData); // Make prediction using loaded model
  console.log("Prediction:", prediction); // Log prediction result

  // Save the prediction
  server.savePrediction(
    // Save prediction using server module
    email,
    parseFloat(prediction[0]).toFixed(2), // Format prediction to two decimal places
    bedrooms, // Pass bedrooms parameter
    bathrooms, // Pass bathrooms parameter
    sqft, // Pass sqft parameter
    parking, // Pass parking parameter
    houseType, // Pass houseType parameter
    lat,
    long
  );

  // Prepare data to send as response
  var dataToSend = {
    prediction: prediction, // Include prediction in the response
  };
  console.log(dataToSend); // Log data to send
  res.status(200).send(dataToSend); // Send data as response
};
