/**
 * Root component for TDC Takehome app.
 * This file is boilerplate; you should not need to edit it much if at all.
 * See `components/CarMap.tsx` for the map UI.
 *
 * @format
 */

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import React from 'react';
import {Platform, SafeAreaView} from 'react-native';
import CarMap from './components/CarMap';

// Note these URLs assume the app is running in a local simulator/emulator
const httpUrl =
  Platform.OS === 'ios'
    ? 'http://localhost:4000/graphql'
    : 'http://10.0.2.2:4000/graphql';
const wsUrl =
  Platform.OS === 'ios'
    ? 'ws://localhost:4000/subscriptions'
    : 'ws://10.0.2.2:4000/subscriptions';

// Initialize Apollo Client and Http/WebSocket links
const httpLink = new HttpLink({
  uri: httpUrl,
});
const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView>
        <CarMap />
      </SafeAreaView>
    </ApolloProvider>
  );
};

export default App;
