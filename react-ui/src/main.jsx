/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "react-auth-kit"; // Import AuthProvider
import createStore from "react-auth-kit/createStore"; // Import createStore

// Create the auth store
const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const link = createHttpLink({
  uri: "http://localhost:5000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ApolloProvider client={client}>
      <AuthProvider store={store}>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </Router>
);
