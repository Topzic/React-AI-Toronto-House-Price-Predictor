// https://github.com/slavaspirin/Toronto-housing-price-prediction
// Import required libraries
const fs = require("fs"); // Library for file system operations
const XLSX = require("xlsx"); // Library for working with Excel files
const { RandomForestRegression } = require("ml-random-forest"); // Machine learning library for Random Forest Regression

// Function to parse bedrooms column
function parseBedrooms(bedrooms) {
  const match = bedrooms.match(/(\d+)\s*\+\s*(\d+)\s*beds/); // Check if bedrooms contain additional beds
  if (match) {
    const mainBedrooms = parseInt(match[1]); // Extract main bedrooms count
    const additionalBedrooms = parseInt(match[2]); // Extract additional bedrooms count
    return mainBedrooms + additionalBedrooms; // Return total bedrooms count
  } else {
    const singleBedroomMatch = bedrooms.match(/(\d+)\s*beds/); // Check if only single bedroom count is provided
    if (singleBedroomMatch) {
      return parseInt(singleBedroomMatch[1]); // Return single bedroom count
    } else {
      return NaN; // Return NaN if bedrooms information is not available
    }
  }
}

// Function to parse type column
function parseType(type) {
  const typeMap = {
    // Map to convert property types to numeric values
    "Condo Apt": 0,
    "Semi-Detached": 1,
    Detached: 2,
    "Condo Townhouse": 3,
    Duplex: 4,
    "Att/Row/Twnhouse": 5,
    "Co-Ownership Apt": 6,
    Link: 7,
    "Comm Element Condo": 8,
  };
  return typeMap[type]; // Return numeric value corresponding to the property type
}

// Function to read data from Excel file and remove records with non-numeric values in numeric columns
function readDataFromExcel(filename, callback) {
  const workbook = XLSX.readFile(filename); // Read Excel workbook
  const sheetName = workbook.SheetNames[0]; // Get the first sheet name
  const worksheet = workbook.Sheets[sheetName]; // Get the first sheet
  const data = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON data

  // Numeric data columns
  const numericColumns = [
    "final_price",
    "list_price",
    "bedrooms",
    "bathrooms",
    "sqft",
    "parking",
    "lat",
    "long",
  ];

  // Valid property types
  const validTypes = new Set([
    "Condo Apt",
    "Semi-Detached",
    "Detached",
    "Condo Townhouse",
    "Duplex",
    "Att/Row/Twnhouse",
    "Co-Ownership Apt",
    "Link",
    "Comm Element Condo",
  ]);

  const cleanedData = data.filter((row) => {
    // Check if type is valid
    if (!validTypes.has(row.type)) {
      return false;
    }

    // Check if all numeric columns have valid values
    return numericColumns.every((col) => {
      const value = row[col];
      // console.log(`Column: ${col}, Value: ${value}`);
      return (
        value !== undefined &&
        // !isNaN(parseFloat(value.replace(/[^0-9.-]/g, "")))
        !isNaN(parseFloat(value))
      );
    });
  });

  callback(cleanedData); // Return cleaned data
}

// Main function
function main() {
  const dataFile = "houses.csv"; // Path to Excel file containing data

  // Read data from Excel file
  console.log("Reading data from Excel file..."); // Log operation start
  readDataFromExcel(dataFile, (data) => {
    // Read data and perform operations on callback
    console.log(`Data read successfully. Total records: ${data.length}`); // Log successful data read

    // Prepare data for training
    console.log("Preparing data for training..."); // Log data preparation start
    const X = data.map((row) => [
      // Prepare features matrix
      parseBedrooms(row.bedrooms), // Parse bedrooms column
      parseFloat(row.bathrooms), // Parse bathrooms column
      parseFloat(row.sqft), // Parse sqft column
      parseFloat(row.parking), // Parse parking column
      parseType(row.type), // Parse type column
      parseFloat(row.lat),
      parseFloat(row.long), // Scale latitude and longitude features
    ]);

    // Prints off all the records
    // console.log("X: " + X); // Log features matrix

    const y = data.map(
      (
        row // Prepare target array
      ) => parseFloat(row.final_price) // Parse final price column
    );

    // Train the model with progress indicator
    console.log("Training the model..."); // Log model training start
    const model = new RandomForestRegression(); // Initialize random forest regression model
    model.train(X, y, {
      // Train the model with parameters
      numberOfTrees: 10, // Number of trees in the forest
      minNumSamples: 2, // Minimum number of samples required to split a node
      maxDepth: 4, // Maximum depth of the trees
      onProgress: (progress) => {
        // Progress callback
        console.error(`Training progress: ${progress * 100}%`); // Log training progress
      },
    });
    console.log("Model trained successfully."); // Log successful model training

    // Save the trained model
    const modelFileName = "house_price_prediction_model.json"; // Path to save the trained model
    fs.writeFileSync(modelFileName, JSON.stringify(model.toJSON())); // Save model as JSON
    console.log(`Trained model saved to ${modelFileName}`); // Log successful model saving

    // Make a prediction
    const newX = [[2, 2, 800, 1, 0, 43.6618956, -79.3857479]];
    console.log("Making prediction..."); // Log prediction making start
    const prediction = model.predict(newX); // Make prediction
    console.log("Prediction:", prediction); // Log prediction result
  });
}

// Run the main function
main();
