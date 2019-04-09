import * as React from "react";
import * as Auth from '../../auth/Auth';

export class LoginBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: Auth.isLoggedIn(),
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    Auth.notifyAuthenticationHandled(() => {
      this.setState({isLoggedIn: Auth.isLoggedIn()});
    });
  }

  render() {
    if (Scrivito.isEditorLoggedIn()) {
      return null;
    }
    return this.state.isLoggedIn
      ? (<Logout logout={this.logout} />)
      : (<Login login={this.login} />);
  }

  login(e) {
    e.stopPropagation();
    e.preventDefault();
    Auth.login();
  }

  logout(e) {
    e.stopPropagation();
    e.preventDefault();
    Auth.logout();
  }
}

function Login(props) {
  return <div onClick={props.login}>Login</div>;
}

function Logout(props) {
  return <div onClick={props.logout}>Logout</div>;
}
