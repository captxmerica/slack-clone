import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Header, Input, Button, Grid, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Login extends React.Component {
  constructor(props) {
    super(props);
    // With mobx state is stored in the 'this' object instead of the 'state' prop
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password },
    });
    const {
      ok, token, refreshToken, errors,
    } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err[passwordError] = 'not long enough'
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  };

  onChange = (e) => {
    const { name, value } = e.target;
    // curly brackets so we get 'email' or 'username' and not the name of the property 'name'
    this[name] = value;
  };

  render() {
    const {
      email,
      password,
      errors: { emailError, passwordError },
    } = this;
    const errorList = [];
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <div className="login-form" style={{ height: '100%', marginTop: '10vh' }}>
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2">Login</Header>
            <Form>
              {' '}
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
              </Button>{' '}
            </Form>
            {errorList.length ? (
              <Message error header="There was some errors with your submission" list={errorList} />
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
