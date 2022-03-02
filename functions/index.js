const functions = require("firebase-functions");

// For accessing Firestore database
const admin = require("firebase-admin");
const express = require("express");

// GraphQL dependencies
const { ApolloServer, gql } = require("apollo-server-express");
// Will initialize with default settings and database
admin.initializeApp();
const db = admin.firestore();
const app = express();

const typeDefs = gql`
  type User {
    firstName: String
    lastName: String
    email: String
  }
  type Name {
    name: String
  }
  type Query {
    users: [User],
    names: [Name]
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return new Promise((resolve, reject) => {
        fetchAllUsers((data) => {
          resolve(data);
        });
      });
    },
    names: () => {
      return new Promise((resolve, reject) => {
        fetchAllNames((data) => {
          resolve(data);
        });
      });
    },

  },
};
// Function to fetch all users from database
const fetchAllUsers = (callback) => {
  db.collection("users")
    .get()
    .then((item) => {
      const items = [];
      item.docs.forEach((item) => {
        items.push(item.data());
      });
      return callback(items);
    })
    .catch((e) => console.log(e));
};

const fetchAllNames = (callback) => {
  db.collection("names")
    .get()
    .then((item) => {
      const items = [];
      item.docs.forEach((item) => {
        items.push(item.data());
      });
      return callback(items);
    })
    .catch((e) => console.log(e));
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/" });
exports.graphql = functions.https.onRequest(app);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
