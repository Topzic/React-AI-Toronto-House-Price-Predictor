// Import required libraries
const fs = require("fs"); // Library for file system operations
const { RandomForestRegression } = require("ml-random-forest"); // Machine learning library for Random Forest Regression

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

// Main function
function main() {
  const modelFileName = "house_price_prediction_model.json"; // Path to trained model JSON file

  // Load the trained model
  console.log("Loading the trained model..."); // Log model loading start
  const model = loadModel(modelFileName); // Load the model from file
  console.log("Model loaded successfully."); // Log successful model loading

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
  // const newX = [[1, 1, 800, 1, 0, 43.7864226, -79.1739851]]; // Example input for prediction
  const testInput1 = [[2, 2, 800, 1, 0, 43.6618956, -79.3857479]];
  const testInput2 = [[2, 2, 800, 1, 0, 43.650121, -79.379345]];
  const testInput3 = [[2, 2, 800, 1, 0, 43.664271, -79.386962]];
  const testInput4 = [[2, 2, 800, 1, 0, 43.653225, -79.383186]];
  const testInput5 = [[2, 2, 800, 1, 0, 43.667856, -79.395423]];

  // Use these test inputs to make predictions with your model

  // Make prediction using the loaded model
  console.log("Making prediction..."); // Log prediction making start

  const prediction1 = makePrediction(model, testInput1); // Make prediction using loaded model
  console.log("Prediction:", prediction1); // Log prediction result

  const prediction2 = makePrediction(model, testInput2); // Make prediction using loaded model
  console.log("Prediction:", prediction2); // Log prediction result

  const prediction3 = makePrediction(model, testInput3); // Make prediction using loaded model
  console.log("Prediction:", prediction3); // Log prediction result

  const prediction4 = makePrediction(model, testInput4); // Make prediction using loaded model
  console.log("Prediction:", prediction4); // Log prediction result

  const prediction5 = makePrediction(model, testInput5); // Make prediction using loaded model
  console.log("Prediction:", prediction5); // Log prediction result
}

// Run the main function
main();
