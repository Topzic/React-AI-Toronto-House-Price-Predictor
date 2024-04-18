const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
// const { GraphQLSchema } = require("graphql");
// const { queryType, mutation } = require("./graphql/predictionSchema");
var schema = require("./graphql/schemas.js");
const configureMongoose = require("./config/mongoose.js");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const HousePredictionModel = require("./models/Prediction.js");
var cors = require("cors");
// Load the 'index' controller
const index = require("./app/controllers/index.server.controller.js");

// Create Database Instance
const db = configureMongoose();

// Create a new Express application instance
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(methodOverride("_method"));

const corsOptions = {
  origin: [
    "http://localhost:5000",
    "http://localhost:5173",
  ], //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions));

// GraphQL schema
// const schema = new GraphQLSchema({
//   query: queryType,
//   mutation: mutation,
// });

// Configure GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((request, response) => {
    return {
      schema: schema,
      rootValue: global,
      graphiql: true,
      context: {
        req: request,
        res: response,
      },
    };
  })
);

app.get("/run", index.predictHousePrice);

// Prediction endpoint to retrieve all predictions
app.get("/predictions", async (req, res) => {
  try {
    const predictions = await HousePredictionModel.find().exec();
    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.savePrediction = async function (
  prediction,
  bedrooms,
  bathrooms,
  sqft,
  parking,
  houseType
) {
  try {
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
    // res.status(200).json({
    //   message: "Prediction created successfully",
    //   prediction: newPrediction,
    // });
  } catch (error) {
    // If an error occurs, send an error response
    console.log("error: " + error.message);
  }
};

// Prediction endpoint to create a prediction
app.post("/save-prediction", async (req, res) => {});

// Use the Express application instance to listen to the '5000' port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`GraphQL Server is running on http://localhost:${port}/graphql`);
});
