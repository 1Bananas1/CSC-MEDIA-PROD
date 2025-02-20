import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// One-time authentication function
async function authenticate() {
  const existingToken = localStorage.getItem('auth_token');
  if (existingToken) {
    return;
  }

  try {
    const discordId = import.meta.env.VITE_DISCORD_ID;
    const password = import.meta.env.VITE_AUTH_PASSWORD;

    const response = await fetch('https://core.csconfederation.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            tokenAuth(discordId: "${discordId}", password: "${password}") {
              token
              refreshToken
              payload {
                discordId
                exp
                origIat
              }
            }
          }
        `
      })
    });

    const result = await response.json();
    
    if (result.data?.tokenAuth?.token) {
      localStorage.setItem('auth_token', result.data.tokenAuth.token);
    } else if (result.errors) {
      console.error('Authentication failed');
    }
  } catch (error) {
    console.error('Network error during authentication');
  }
}

// Auth link setup
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      ...headers,
      'Authorization': token ? `JWT ${token}` : ''
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.message.includes('token') || err.message.includes('permission')) {
        localStorage.removeItem('auth_token');
        authenticate().then(() => {
          const token = localStorage.getItem('auth_token');
          if (token) {
            operation.setContext({
              headers: {
                ...operation.getContext().headers,
                'Authorization': `JWT ${token}`
              }
            });
            return forward(operation);
          }
        });
      }
    }
  }
});

// Create links for both APIs
const coreLink = new HttpLink({ 
  uri: 'https://core.csconfederation.com/graphql' 
});

const statsLink = new HttpLink({ 
  uri: 'https://stats.csconfederation.com/graphql' 
});

// Create the split link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'query' &&
      definition.name?.value?.includes('PlayerStats')
    );
  },
  statsLink,  // If the above returns true, use stats API
  coreLink    // Otherwise use core API
);

// Combine all links
const link = ApolloLink.from([
  errorLink,
  authLink,
  splitLink
]);

// Create Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// Initial authentication and render
authenticate().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </StrictMode>
  );
});