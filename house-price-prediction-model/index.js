const fs = require("fs");
const XLSX = require("xlsx");
const { RandomForestRegression } = require("ml-random-forest");

// Function to parse sqft column
function parseSqft(sqft) {
  if (sqft === "N/A") {
    return NaN;
  }

  const range = sqft.match(/(\d+)-(\d+)/);
  if (range) {
    const min = parseInt(range[1]);
    const max = parseInt(range[2]);
    return (min + max) / 2;
  } else {
    return parseInt(sqft.match(/\d+/)[0]);
  }
}

// Function to parse bedrooms column
function parseBedrooms(bedrooms) {
  const match = bedrooms.match(/(\d+)\s*\+\s*(\d+)\s*beds/);
  if (match) {
    const mainBedrooms = parseInt(match[1]);
    const additionalBedrooms = parseInt(match[2]);
    return mainBedrooms + additionalBedrooms;
  } else {
    const singleBedroomMatch = bedrooms.match(/(\d+)\s*beds/);
    if (singleBedroomMatch) {
      return parseInt(singleBedroomMatch[1]);
    } else {
      return NaN;
    }
  }
}

// Function to parse parking column
function parseParking(parking) {
  // Check if parking contains numeric information
  const numericParking = parseFloat(parking.replace(/[^0-9.]/g, ""));
  return isNaN(numericParking) ? 0 : numericParking;
}

// Function to parse type column
function parseType(type) {
  const typeMap = {
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
  return typeMap[type];
}

// Function to read data from Excel file and remove records with non-numeric values in numeric columns
function readDataFromExcel(filename, callback) {
  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  const numericColumns = [
    "final_price",
    "list_price",
    "bedrooms",
    "bathrooms",
    "sqft",
    "parking",
  ];

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
      return (
        value !== undefined &&
        !isNaN(parseFloat(value.replace(/[^0-9.-]/g, "")))
      );
    });
  });

  callback(cleanedData);
}

// Main function
function main() {
  const dataFile = "data.xlsx";

  // Read data from Excel file
  console.log("Reading data from Excel file...");
  readDataFromExcel(dataFile, (data) => {
    console.log(`Data read successfully. Total records: ${data.length}`);

    // Prepare data for training
    console.log("Preparing data for training...");
    const X = data.map((row) => [
      parseBedrooms(row.bedrooms), // Parse bedrooms column
      parseFloat(row.bathrooms.replace(/[^0-9.]/g, "")),
      parseSqft(row.sqft), // Parse sqft column
      parseParking(row.parking.replace(/[^0-9.]/g, "")),
      parseType(row.type), // Parse type column
    ]);
    console.log("X: " + X);

    const y = data.map((row) =>
      parseFloat(row.final_price.replace(/[^0-9.-]/g, ""))
    );

    // Train the model with progress indicator
    console.log("Training the model...");
    const model = new RandomForestRegression();
    model.train(X, y, {
      numberOfTrees: 10,
      minNumSamples: 2,
      maxDepth: 4,
      onProgress: (progress) => {
        console.log(`Training progress: ${progress * 100}%`);
      },
    });
    console.log("Model trained successfully.");

    // Save the trained model
    const modelFileName = "house_price_prediction_model.json";
    fs.writeFileSync(modelFileName, JSON.stringify(model.toJSON()));

    console.log(`Trained model saved to ${modelFileName}`);

    // Make a prediction
    const newX = [[2, 2, 800, 1, 0]]; // Example input for prediction
    console.log("Making prediction...");
    const prediction = model.predict(newX);
    console.log("Prediction:", prediction);
  });
}

// Run the main function
main();
