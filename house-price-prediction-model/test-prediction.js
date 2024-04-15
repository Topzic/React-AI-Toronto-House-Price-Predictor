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
  const newX = [[1, 1, 800, 1, 0]]; // Example input for prediction

  // Make prediction using the loaded model
  console.log("Making prediction..."); // Log prediction making start
  const prediction = makePrediction(model, newX); // Make prediction using loaded model
  console.log("Prediction:", prediction); // Log prediction result
}

// Run the main function
main();
