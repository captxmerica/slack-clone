import React from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
  };

  onChange = e => {
    const { name, value } = e.target;
    //curly brackets so we get 'email' or 'username' and not the name of the property 'name'
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
     await this.props.mutate({
      variables: this.state,
    });
    this.setState({})

  render() {
    const { username, email, password } = this.state;
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input
          name="username"
          onChange={this.onChange}
          value={username}
          placeholder="username"
          fluid
        />
        <Input name="email" onChange={this.onChange} value={email} placeholder="email" fluid />
        <Input
          name="password"
          onChange={this.onChange}
          value={password}
          type="password"
          placeholder="password"
          fluid
        />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export default graphql(registerMutation)(Register);
