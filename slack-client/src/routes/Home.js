import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const Home = () => (
  <Query
    query={gql`
      {
        allUsers {
          id
          email
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.allUsers.map(u => <h1 key={u.id}>{u.email}</h1>);
    }}
  </Query>
);

export default Home;
