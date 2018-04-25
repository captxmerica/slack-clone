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

const token = localStorage.getItem('token');
const middlewareLink = setContext(() => ({
  headers: {
    authorization: `Bearer ${token}` || null,
  },
}));
const link = middlewareLink.concat(httpLink);
const client = new ApolloClient({
  link,
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
