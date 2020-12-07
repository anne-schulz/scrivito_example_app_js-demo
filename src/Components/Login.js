import * as React from "react";

import { login, logout, onLoginStateChange } from "../Auth/LoginState";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  componentDidMount() {
    this.cleanupStateChangeNotifications = onLoginStateChange((isLoggedIn) => {
      this.setState({ isLoggedIn });
    });
  }

  componentWillUnmount() {
    this.cleanupStateChangeNotifications();
  }

  render() {
    if (this.state.isLoggedIn === "disabled") {
      return (
        <button className="text-white strong" disabled>
          Sign in
        </button>
      );
    }

    return this.state.isLoggedIn ? (
      <button className="text-danger strong" onClick={onLogout}>
        Log out
      </button>
    ) : (
      <button className="text-white strong" onClick={onLogin}>
        Sign in
      </button>
    );
  }
}

function onLogin(e) {
  e.stopPropagation();
  e.preventDefault();
  login();
}

function onLogout(e) {
  e.stopPropagation();
  e.preventDefault();
  logout();
}
