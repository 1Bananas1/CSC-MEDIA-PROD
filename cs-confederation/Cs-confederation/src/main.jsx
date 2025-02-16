import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const coreLink = new HttpLink({ uri: 'https://core.csconfederation.com/graphql' });
const statsLink = new HttpLink({ uri: 'https://stats.csconfederation.com/graphql' });

// Split queries between core and stats APIs
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    // Send matches and tiers queries to stats API
    if (definition.kind === 'OperationDefinition') {
      const operationName = definition.name?.value || '';
      return operationName.includes('Matches') || operationName.includes('Tiers');
    }
    return false;
  },
  statsLink, // If true, use stats API
  coreLink   // If false, use core API
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);