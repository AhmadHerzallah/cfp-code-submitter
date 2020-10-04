import React, { useState } from "react";
import "./styles.css";
import Code from "./Code";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import NavBar from "./NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PastProblems from "./PastProblems";
import Gists from './Gists';
import TAs from './TAs';

import PreviousSubmissions from './PreviousSubmissions';

var firebaseConfig = {
  apiKey: "AIzaSyBQLxaTvjqJKTLeNEae1J2ZeufVUpQfnLM",
  authDomain: "cfp-code-submitter.firebaseapp.com",
  databaseURL: "https://cfp-code-submitter.firebaseio.com",
  projectId: "cfp-code-submitter",
  storageBucket: "cfp-code-submitter.appspot.com",
  messagingSenderId: "483775167429",
  appId: "1:483775167429:web:6c0f89494372bc871829ac",
  measurementId: "G-L6BZEQ6ZJ9"
};

try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch { }

export default class App extends React.Component {
  state = {
    isSignedIn: false,
  };

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };
  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();

  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <head>
            <title>CFP Code Submitter</title>
          </head>
          <NavBar name="hatem" signedIn={false} />
          <h1 className="welcome-msg">
            Welcome to All Code for Palestine Students, TAs, and Instructors
          </h1>
          <p className="signin-msg">Please sign-in:</p>
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
          <h4 className="version">v 1.0.0 beta</h4>
          <h5 className="version">Github Login is working!</h5>
          <h4 className="notify">Thanks to everyone who sent me a heads up regarding the signin page poping up whenever page changes. Due to some technical issues, this bug will take a while to fix, henceforth, I urge you to overlook it for a while (since it's been less than two days from the first line of code for this website)</h4>
        </div>
      );
    } else {
      return (
        <div>
          <head>
            <title>CFP Code Submitter</title>
          </head>
          <Router>
            <div>
              <NavBar
                name={firebase.auth().currentUser.displayName}
                signedIn={true}
                isSuperUser={firebase.auth().currentUser.uid == "QDQ3iECmX1RIu2mJkNlQJHIlmkg1" || firebase.auth().currentUser.uid == "fZlj3iLifVM49ixPPzucktMgrkq2" || firebase.auth().currentUser.uid == "w80C141S5CQA8qcWGadFlzHuAbO2"}
              />
              <Switch>

                <Route path="/main">
                  <Code name={firebase.auth().currentUser.displayName} />
                </Route>
                <Route path="/pastproblems">
                  <PastProblems />
                </Route>
                <Route path="/gists">
                  <Gists />
                </Route>
                <Route path="/previous-submissions">
                  <PreviousSubmissions nameOfUser={firebase.auth().currentUser.displayName} />
                </Route>
                <Route path="/admin">
                  {firebase.auth().currentUser.uid == "QDQ3iECmX1RIu2mJkNlQJHIlmkg1" || firebase.auth().currentUser.uid == "fZlj3iLifVM49ixPPzucktMgrkq2" || firebase.auth().currentUser.uid == "w80C141S5CQA8qcWGadFlzHuAbO2" ?
                    <TAs /> :
                    <h1>Sorry You do not have permission to view this page</h1>
                  }
                </Route>
                <Route path="/">
                  <Code name={firebase.auth().currentUser.displayName} />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      );
    }
  }
}

