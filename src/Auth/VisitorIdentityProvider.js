import * as Scrivito from "scrivito";
import { parseIsolatedEntityName } from "typescript";
import { CognitoAuthWrapper } from "./CognitoAuthWrapper";

const auth = new CognitoAuthWrapper({
  domain: process.env.AUTH_DOMAIN,
  clientId: process.env.AUTH_CLIENT_ID,
  redirectUri: `${window.location.origin}/`,
  userPoolId: process.env.AUTH_USER_POOL_ID,
});

auth.onTokenSuccess(() => {
  Scrivito.setVisitorIdToken(auth.getIdToken());
  // PisaLib.setIdToken(auth.getIdToken());
});

auth.onTokenFailure(() => {
  auth.logout();
});

export function loginVisitor() {
  auth.login();
}

export function logoutVisitor() {
  auth.logout();
}

export function notifyOnLogin(callback) {
  auth.onTokenSuccess(() => {
    callback();
  });
}

export function notifyOnTokenFailure(callback) {
  auth.onTokenFailure(() => {
    callback();
  });
}

export function getVisitorAuthentication() {
  if (Scrivito.isEditorLoggedIn()) {
    return false;
  }

  const { hash } = window.location;
  if (hash && hash.substr(0, 9) === "#id_token") {
    console.log("HAS #id_token"); // eslint-disable-line
    auth.handleAuthentication();
    window.history.pushState("", document.title, window.location.pathname);
    return true;
  }

  if (auth.isLoggedIn()) {
    console.log("I AM LOGGED IN"); // eslint-disable-line
    auth.renewSession();
    return true;
  }

  return false;
}
