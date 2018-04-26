import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import 'semantic-ui-css/semantic.min.css';

import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const httpLink = createHttpLink({ uri: 'http://localhost:8081/graphql' });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
      'x-token': token,
      'x-refresh-token': refreshToken,

    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// client.use([
//   {
//     applyMiddleWare(req, next) {
//       if (!req.options.headers) {
//         req.options.headers = {};
//       }
//       req.options.headers['x-token'] = localStorage.getItem('token');
//       req.options.headers['x-refresh-token'] = localStorage.getItem('refreshToken');
//       const token = localStorage.getItem('token');
//       req.options.headers.authorization = token ? `Bearer ${token}` : null;
//       next();
//     },
//   },
// ]);

// client.useAfter([
//   {
//     applyAfterware({ response: headers }, next) {
//       const token = headers.get('x-token');
//       const refreshToken = headers.get('x-refresh-token');

//       if (token) {
//         localStorage.setItem('token', token);
//       }
//       if (refreshToken) {
//         localStorage.setItem('refreshToken', refreshToken);
//       }
//       next();
//     },
//   },
// ]);

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
