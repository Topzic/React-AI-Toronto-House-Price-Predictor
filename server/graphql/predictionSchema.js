const GraphQLSchema = require("graphql").GraphQLSchema;
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLFloat = require("graphql").GraphQLFloat;

const HousePredictionModel = require("../models/Prediction");

const housePredictionType = new GraphQLObjectType({
  name: "HousePrediction",
  fields: function () {
    return {
      _id: {
        type: GraphQLFloat,
      },
      prediction: {
        type: GraphQLFloat,
      },
      bedrooms: {
        type: GraphQLFloat,
      },
      bathrooms: {
        type: GraphQLFloat,
      },
      sqft: {
        type: GraphQLFloat,
      },
      parking: {
        type: GraphQLFloat,
      },
      houseType: {
        type: GraphQLFloat,
      },
    };
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      housePredictions: {
        type: new GraphQLList(housePredictionType),
        resolve: function () {
          const predictions = HousePredictionModel.find().exec();
          if (!predictions) {
            throw new Error("Error fetching house predictions");
          }
          return predictions;
        },
      },
      housePrediction: {
        type: housePredictionType,
        args: {
          id: {
            type: GraphQLFloat,
          },
        },
        resolve: function (root, params) {
          const prediction = HousePredictionModel.findById(params.id).exec();
          if (!prediction) {
            throw new Error("House prediction not found");
          }
          return prediction;
        },
      },
    };
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      createHousePrediction: {
        type: housePredictionType,
        args: {
          prediction: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          bedrooms: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          bathrooms: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          sqft: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          parking: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          houseType: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
        },
        resolve: function (root, params) {
          const predictionModel = new HousePredictionModel(params);
          const newPrediction = predictionModel.save();
          if (!newPrediction) {
            throw new Error("Error creating house prediction");
          }
          return newPrediction;
        },
      },
    };
  },
});

module.exports = { housePredictionType, queryType, mutation };
