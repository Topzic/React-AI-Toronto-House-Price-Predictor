const mongoose = require("mongoose");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
var GraphQLSchema = require("graphql").GraphQLSchema;
const queryType = require("./graphql/predictionSchema").queryType;
const mutation = require("./graphql/predictionSchema").mutation;
const configureExpress = require("express");
const configureMongoose = require("./config/mongoose.js");

// Create Database Instance
const db = configureMongoose();

// Create a new Express application instance
const app = configureExpress();

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

// Use the Express application instance to listen to the '3000' port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`GraphQL Server is running on http://localhost:${port}/graphql`);
});

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;
