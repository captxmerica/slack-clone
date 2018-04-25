import React from 'react';
import { Header, Input, Button, Message, Grid, Segment, Form } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends React.Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onChange = (e) => {
    const { name, value } = e.target;
    // curly brackets so we get 'email' or 'username' and not the name of the property 'name'
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password },
    });

    const { ok, errors } = response.data.register;
    if (ok) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err[passwordError] = 'not long enough'
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }
  };

  render() {
    const {
      username, email, password, usernameError, emailError, passwordError,
    } = this.state;
    const errorList = [];
    if (usernameError) {
      errorList.push(usernameError);
    }
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <div className="register-form" style={{ height: '100%', marginTop: '10vh' }}>
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2">Register</Header>

            <Segment stacked>
              <Form>
                <Input
                  error={!!usernameError}
                  name="username"
                  onChange={this.onChange}
                  value={username}
                  placeholder="username"
                  icon="user"
                  iconPosition="left"
                  fluid
                />
                <Input
                  error={!!emailError}
                  name="email"
                  onChange={this.onChange}
                  value={email}
                  placeholder="email"
                  icon="mail"
                  iconPosition="left"
                  fluid
                />
                <Input
                  error={!!passwordError}
                  name="password"
                  onChange={this.onChange}
                  value={password}
                  type="password"
                  placeholder="password"
                  icon="lock"
                  iconPosition="left"
                  fluid
                />
                <br />
                <Button onClick={this.onSubmit} color="twitter">
                  Submit
                </Button>
              </Form>
            </Segment>

            {errorList.length ? (
              <Message error header="There was some errors with your submission" list={errorList} />
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
