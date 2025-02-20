import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// One-time authentication function
async function authenticate() {
  // Check if we already have a valid token
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

// Create the auth link for stats API
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  
  return {
    headers: {
      ...headers,
      'Authorization': token ? `JWT ${token}` : ''
    }
  };
});

// Create links for both APIs
const coreLink = new HttpLink({ 
  uri: 'https://core.csconfederation.com/graphql' 
});

const statsLink = authLink.concat(new HttpLink({ 
  uri: 'https://stats.csconfederation.com/graphql' 
}));

// Error handling link to catch token expiration
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // If we get a token expiration error, clear the token and re-authenticate
      if (err.message.includes('token') || err.message.includes('permission')) {
        localStorage.removeItem('auth_token');
        authenticate().then(() => {
          // Retry the failed request
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

// Split requests between APIs
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    if (definition.kind === 'OperationDefinition') {
      const operationName = definition.name?.value || '';
      return operationName.includes('Matches') || operationName.includes('Tiers');
    }
    return false;
  },
  statsLink,
  coreLink
);

// Create Apollo Client
const client = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache: new InMemoryCache(),
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