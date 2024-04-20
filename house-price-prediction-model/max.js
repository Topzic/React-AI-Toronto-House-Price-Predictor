// Import required libraries
const XLSX = require("xlsx"); // Library for working with Excel files

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

  let maxLat = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLong = Number.NEGATIVE_INFINITY;
  let minLong = Number.POSITIVE_INFINITY;

  const cleanedData = data.filter((row) => {
    // Check if type is valid
    if (!validTypes.has(row.type)) {
      return false;
    }

    // Check if all numeric columns have valid values
    return numericColumns.every((col) => {
      const value = parseFloat(row[col]);
      if (col === "lat") {
        // Update max and min latitude
        maxLat = Math.max(maxLat, value);
        minLat = Math.min(minLat, value);
      } else if (col === "long") {
        // Update max and min longitude
        maxLong = Math.max(maxLong, value);
        minLong = Math.min(minLong, value);
      }
      return !isNaN(value);
    });
  });

  callback(cleanedData, { maxLat, minLat, maxLong, minLong }); // Return cleaned data and max/min values for lat and long
}

// Main function
function main() {
  const dataFile = "houses.csv"; // Path to Excel file containing data

  // Read data from Excel file
  console.log("Reading data from Excel file..."); // Log operation start
  readDataFromExcel(dataFile, (data, { maxLat, minLat, maxLong, minLong }) => {
    // Read data and perform operations on callback
    console.log(`Data read successfully. Total records: ${data.length}`); // Log successful data read

    console.log("Maximum Latitude:", maxLat);
    console.log("Minimum Latitude:", minLat);
    console.log("Maximum Longitude:", maxLong);
    console.log("Minimum Longitude:", minLong);
  });
}

// Run the main function
main();
