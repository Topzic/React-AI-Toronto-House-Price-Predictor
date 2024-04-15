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

// Main function
function main() {
  const modelFileName = "house_price_prediction_model.json";

  // Load the trained model
  console.log("Loading the trained model...");
  const model = loadModel(modelFileName);
  console.log("Model loaded successfully.");

  // Example input data for prediction
  // Bedroom, Bathroom, Sqft, Parking, House Type
  // Condo Apt: 0,
  // Semi-Detached: 1,
  // Detached: 2,
  // Condo Townhouse: 3,
  // Duplex: 4,
  // Att/Row/Twnhouse: 5,
  // Co-Ownership Apt: 6,
  // Link: 7,
  // Comm Element Condo: 8,
  const newX = [[1, 1, 800, 1, 0]]; // Example input for prediction

  // Make prediction using the loaded model
  console.log("Making prediction...");
  const prediction = makePrediction(model, newX);
  console.log("Prediction:", prediction);
}

// Run the main function
main();
