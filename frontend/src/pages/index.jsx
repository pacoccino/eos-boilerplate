import React, { Component } from 'react';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Contract from '../lib/contract_example';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0,
  },
});

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
        profileTable: [] // to store the table rows from smart contract
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account_name = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let firstName = event.target.firstName.value;
    let age = event.target.age.value;

    const account = {
      account_name,
      privateKey,
    }
    await Contract.setProfile(account, { firstName, age })
        .then(() => this.getTable())
        .catch(console.error);

  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
      Contract.getProfiles().then(rows => this.setState({ profileTable: rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { profileTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, row) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {row.user}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {row.firstName}
          </Typography>
          <Typography component="pre">
            {row.age}
          </Typography>
        </CardContent>
      </Card>
    );
    let profiles = profileTable.map((row, i) =>
      generateCard(i, row));

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Example app
            </Typography>
          </Toolbar>
        </AppBar>
        {profiles}
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="account"
              autoComplete="off"
              label="Account"
              margin="normal"
              fullWidth
            />
            <TextField
              name="privateKey"
              autoComplete="off"
              label="Private key"
              margin="normal"
              fullWidth
            />
            <TextField
              name="firstName"
              autoComplete="off"
              label="First name"
              margin="normal"
              fullWidth
            />
            <TextField
              name="age"
              autoComplete="off"
              label="Age"
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit">
              Add / Update note
            </Button>
          </form>
        </Paper>
        <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update profile:
          <br/><br/>
          accounts = { JSON.stringify(Contract.accounts, null, 2) }
        </pre>
      </div>
    );
  }

}

export default withStyles(styles)(Index);
