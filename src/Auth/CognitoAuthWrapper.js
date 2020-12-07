import { CognitoAuth } from "amazon-cognito-auth-js";

export class CognitoAuthWrapper {
  constructor({ domain, clientId, redirectUri, userPoolId }) {
    this.webAuth = new CognitoAuth({
      ClientId: clientId,
      AppWebDomain: domain,
      TokenScopesArray: ["openid", "profile", "email"],
      RedirectUriSignIn: redirectUri,
      RedirectUriSignOut: redirectUri,
      // IdentityProvider: undefined,
      UserPoolId: userPoolId,
      // AdvancedSecurityDataCollectionFlag: true,
      // Storage: localStorage,
    });
    this.webAuth.userhandler = {
      onSuccess: (cognitoSession) => {
        console.log(cognitoSession); // eslint-disable-line
        const idToken = cognitoSession.getIdToken().getJwtToken();
        const accessToken = cognitoSession.getAccessToken().getJwtToken();
        const expiresAt = cognitoSession.getIdToken().getExpiration();
        console.log(idToken); // eslint-disable-line
        console.log(accessToken); // eslint-disable-line
        console.log(expiresAt); // eslint-disable-line
        this.setSession({ accessToken, idToken, expiresAt });
        this.refreshSessionBeforeExpiration();
        this.tokenSuccessCallbacks.forEach((callback) => callback());
      },
      onFailure: (_err) => {
        alert("Error!"); // eslint-disable-line
        this.clearSessionRenewal();
        this.tokenFailureCallbacks.forEach((callback) => callback());
      },
    };

    this.tokenSuccessCallbacks = [];
    this.tokenFailureCallbacks = [];

    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
  }

  // token lifecycle hooks

  onTokenSuccess(callback) {
    return addEntry(this.tokenSuccessCallbacks, callback);
  }

  onTokenFailure(callback) {
    return addEntry(this.tokenFailureCallbacks, callback);
  }

  // state

  getIdToken() {
    return this.idToken;
  }

  // called if the user is expected to already be logged in, initially
  getSession() {
    this.webAuth.getSession();
  }

  // called if the user is expected to already be logged in, initially
  login() {
    this.webAuth.getSession();
  }

  handleReturnUrl() {
    const isReturnUrl = isIdTokenReturnUrl(window.location);
    console.log("HAS #id_token", isReturnUrl); // eslint-disable-line

    this.webAuth.parseCognitoWebResponse(window.location.href);

    if (isReturnUrl && isIdTokenReturnUrl(window.location)) {
      window.history.pushState("", document.title, window.location.pathname);
    }

    return isReturnUrl;
  }

  renewSession() {
    // TODO: Must not return a cached session if called from expiry prevention
    this.webAuth.getSession();
  }

  logout() {
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    this.webAuth.signOut();
    this.clearSessionRenewal();
  }

  // private parts

  setSession({ accessToken, idToken, expiresAt }) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.expiresAt = expiresAt;

    this.tokenSuccessCallbacks.forEach((callback) => callback());
  }

  handleAuthResult(action, authResult, err) {
    const error = validateAuthResult(authResult, err);
    if (error) {
      this.tokenFailureCallbacks.forEach((callback) => callback(action));
      return;
    }

    this.setSession(authResult);
  }

  refreshSessionBeforeExpiration() {
    this.clearSessionRenewal();

    const dayMillis = 24 * 60 * 60 * 1000;
    let sleepMillis = this.expiresAt - new Date().getTime() - 10000;
    if (sleepMillis > dayMillis) {
      sleepMillis = dayMillis;
    }
    this.expirationTimeout = setTimeout(() => this.renewSession(), sleepMillis);
  }

  clearSessionRenewal() {
    if (this.expirationTimeout) {
      clearTimeout(this.expirationTimeout);
      this.expirationTimeout = undefined;
    }
  }
}

function isIdTokenReturnUrl(windowLocation) {
  const { hash } = windowLocation;
  return hash && hash.substr(0, 9) === "#id_token";
}

function addEntry(list, entry) {
  list.push(entry);
  return () => {
    const index = list.indexOf(entry);
    list.splice(index, 1);
  };
}

function validateAuthResult(authResult, err) {
  const missing = [];
  if (authResult) {
    ["accessToken", "idToken"].forEach((p) => {
      if (!authResult[p]) {
        missing.push(p);
      }
    });
  } else {
    missing.push("no authResult");
  }

  if (!missing.length) {
    return;
  }

  return (
    (err && err.error) ||
    new Error(
      `Failed to obtain session (no error). Missing: ${missing.join(", ")}`
    )
  );
}
