import { ApolloServer, gql } from "apollo-server-express";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import http from "http";
import { startPublishingLocationUpdates } from "./carLocationGenerator";
import { pubsub } from "./pubsub";
import { CAR_CHANGED } from "./keys";
const app = express();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
  type Car {
    id: Int
    location: Location
    destination: Location
    distanceToDestination: Int
  }
  type Location {
    latitude: Float
    longitude: Float
  }
  type Subscription {
    updatedCars: [Car]
  }

  # This is where you should add types to the schema to describe a car and its location
  # as well as a GraphQL Subscription root.
  # See https://www.apollographql.com/docs/apollo-server/data/subscriptions/#schema-definition
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Subscription: {
    updatedCars: {
      subscribe: () => pubsub.asyncIterator([CAR_CHANGED]),
    },
  },
  // This is where you should add a resolver for the Subscription defined above.
  // See https://www.apollographql.com/docs/apollo-server/data/subscriptions/#resolving-a-subscription
};

// This initializes the simulation of car locations. You may need to add arguments to this call.
startPublishingLocationUpdates();

// Below is boilerplate to initialize Apollo and the http and subscription servers.
// You should not need to edit anything below this point.

const schema = makeExecutableSchema({ typeDefs, resolvers });

let apolloServer: ApolloServer | null = null;
async function startServer() {
  apolloServer = new ApolloServer({
    schema,
  });
  await apolloServer!.start();
  apolloServer!.applyMiddleware({ app });

  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,

      subscribe,
    },
    {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: "/subscriptions",
    }
  );

  httpServer.listen(4000, "0.0.0.0", function () {
    console.log(`server running on port 4000`);
    console.log(`gql path is ${apolloServer!.graphqlPath}`);
  });

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => subscriptionServer.close());
  });
}
startServer();
