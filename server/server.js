const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const { GraphQLSchema } = require("graphql");
const { queryType, mutation } = require("./graphql/predictionSchema");
const configureMongoose = require("./config/mongoose.js");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const HousePredictionModel = require("./models/Prediction.js");

// Create Database Instance
const db = configureMongoose();

// Create a new Express application instance
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(methodOverride("_method"));

// GraphQL schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
});

// Configure GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Prediction endpoint
app.post("/prediction", async (req, res) => {
  try {
    console.log("req.body: " + req.body);

    // Extract data from the request body
    const { prediction, bedrooms, bathrooms, sqft, parking, houseType } =
      req.body;
    console.log("Prediction: " + prediction);

    // Create a new instance of HousePredictionModel
    const newPrediction = new HousePredictionModel({
      prediction,
      bedrooms,
      bathrooms,
      sqft,
      parking,
      houseType,
    });

    // Save the new prediction to the database
    await newPrediction.save();

    // Send a success response
    res.status(200).json({
      message: "Prediction created successfully",
      prediction: newPrediction,
    });
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
});

// Use the Express application instance to listen to the '5000' port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`GraphQL Server is running on http://localhost:${port}/graphql`);
});
