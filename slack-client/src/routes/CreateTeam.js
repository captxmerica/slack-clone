import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Header, Input, Button, Grid, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    // With mobx state is stored in the 'this' object instead of the 'state' prop
    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  onSubmit = async () => {
    const { name } = this;
    let response = null;
    try {
      response = await this.props.mutate({
        variables: { name },
      });
    } catch (err) {
      this.props.history.push('/login');
      return;
    }

    const { ok, errors } = response.data.createTeam;
    if (ok) {
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
      name,
      errors: { nameError },
    } = this;
    const errorList = [];
    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <div className="login-form" style={{ height: '100%', marginTop: '10vh' }}>
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2">Create Team</Header>
            <Form>
              {' '}
              <Input
                error={!!nameError}
                name="name"
                onChange={this.onChange}
                value={name}
                placeholder="Team Name"
                icon="group"
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

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
