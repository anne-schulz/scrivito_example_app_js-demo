import * as React from "react";

import {
  loginVisitor,
  logoutVisitor,
  notifyOnLogin,
  notifyOnTokenFailure,
} from "../Auth/VisitorIdentityProvider";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  componentDidMount() {
    notifyOnLogin(() => this.setState({ isLoggedIn: true }));
    notifyOnTokenFailure(() => this.setState({ isLoggedIn: false }));
  }

  render() {
    return this.state.isLoggedIn ? (
      <button className="text-danger strong" onClick={logout}>
        Log out
      </button>
    ) : (
      <button className="text-white strong" onClick={signin}>
        Sign in
      </button>
    );
  }
}

function signin(e) {
  e.stopPropagation();
  e.preventDefault();
  loginVisitor();
}

function logout(e) {
  e.stopPropagation();
  e.preventDefault();
  logoutVisitor();
}
