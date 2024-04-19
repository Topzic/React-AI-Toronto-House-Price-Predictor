//
// A GraphQL schema that defines types, queries and mutations
//
var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;
var GraphQLDate = require("graphql-date");
var GraphQLBoolean = require("graphql").GraphQLBoolean;
const GraphQLFloat = require("graphql").GraphQLFloat;
//
var UserModel = require("../models/User");
const HousePredictionModel = require("../models/Prediction");
//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key"; // generate this elsewhere
const jwtExpirySeconds = 300;
//
// Create a GraphQL Object Type for User model
// The fields object is a required property of a GraphQLObjectType
// and it defines the different fields or query/mutations that are available
// in this type.
const userType = new GraphQLObjectType({
  name: "user",
  fields: function () {
    return {
      _id: {
        type: GraphQLFloat,
      },
      email: {
        type: GraphQLString,
      },
      role: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
    };
  },
});

const housePredictionType = new GraphQLObjectType({
  name: "HousePrediction",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
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
      lat: {
        type: GraphQLFloat,
      },
      long: {
        type: GraphQLFloat,
      },
    };
  },
});

// Create a GraphQL query type that returns a user by id
// In this case, the queries are defined within the fields object.
// The fields object is a required property of a GraphQLObjectType
// and it defines the different fields or query/mutations that are available
// in this type.
//
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

      users: {
        type: new GraphQLList(userType),
        resolve: function () {
          const users = UserModel.find().exec();
          if (!users) {
            throw new Error("Error");
          }
          return users;
        },
      },
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLFloat,
          },
        },
        resolve: function (root, params) {
          const userInfo = UserModel.findById(params.id).exec();
          if (!userInfo) {
            throw new Error("Error");
          }
          return userInfo;
        },
      },
    };
  },
});
//
// Add a mutation for creating user
// In this case, the createUser mutation is defined within the fields object.
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      createUser: {
        type: userType,
        args: {
          email: {
            type: GraphQLString,
            unqiue: true,
            required: true,
          },
          password: {
            type: GraphQLString,
            required: true,
          },
        },
        resolve: async function (root, params, context) {
          let { email, password } = params;

          // Check if a user with the same email already exists
          const existingUser = await UserModel.findOne({ email }).exec();
          if (existingUser) {
            console.log("User already exsist");
            return;
          }

          const userModel = new UserModel({ email, password });
          const newUser = await userModel.save();
          console.log("User Successfully Registred: ", newUser);
          if (!newUser) {
            throw new Error("Error creating user");
          }
          return newUser;
        },
      },

      // Mutation to log in the user
      loginUser: {
        type: new GraphQLObjectType({
          name: "LoginUserResponse",
          fields: () => ({
            email: { type: GraphQLString },
            role: { type: GraphQLString },
            token: { type: GraphQLString },
          }),
        }),
        args: {
          email: { type: GraphQLString },
          password: { type: GraphQLString },
        },
        resolve: async function (root, { email, password }, context) {
          try {
            console.log("Searching for user...");
            // Find the user by email
            const userInfo = await UserModel.findOne({ email }).exec();
            if (!userInfo) {
              throw new Error("User not found");
            }

            // Check if the password is correct
            const isValidPassword = await bcrypt.compare(
              password,
              userInfo.password
            );
            if (!isValidPassword) {
              throw new Error("Invalid login credentials");
            }

            // Generate JWT token
            const token = jwt.sign(
              {
                _id: userInfo._id,
                email: userInfo.email,
                role: userInfo.role,
              },
              JWT_SECRET,
              { expiresIn: jwtExpirySeconds }
            );

            console.log("User Successfull Authenticated...");
            // Return user information along with the token
            return {
              email: userInfo.email,
              role: userInfo.role,
              token: token, // Include token here
            };
          } catch (error) {
            console.error("Error logging in:", error.message);
            throw new Error("Authentication failed");
          }
        },
      },
      //Mutation to create house prediction
      createHousePrediction: {
        type: housePredictionType,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
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
          lat: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
          long: {
            type: new GraphQLNonNull(GraphQLFloat),
          },
        },
        resolve: async function (root, params) {
          try {
            const predictionModel = new HousePredictionModel(params);
            const newPrediction = await predictionModel.save();
            console.log("params: " + params);
            if (!newPrediction) {
              throw new Error("Error creating house prediction");
            }
            return newPrediction;
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
      // Mutation to search predictions by email
      predictionsByEmail: {
        type: new GraphQLList(housePredictionType),
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, { email }) => {
          try {
            const predictions = await HousePredictionModel.find({
              email,
            }).exec();
            if (!predictions) {
              throw new Error("No predictions found for the specified email");
            }
            return predictions;
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
      // Mutation to delete prediction by id
      deletePrediction: {
        type: housePredictionType,
        args: {
          id: { type: GraphQLString },
        },
        resolve(parent, args) {
          return HousePredictionModel.findByIdAndDelete(args.id);
        },
      },
    };
  },
});
//
module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
  housePredictionType,
});
