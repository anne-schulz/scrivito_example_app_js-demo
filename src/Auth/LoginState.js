import * as Scrivito from "scrivito";
import { CognitoAuthWrapper } from "./CognitoAuthWrapper";

const key = "Scrivito.visitorIdentity.isLoggedIn";

// undefined  - initially)
// "disabled" - UI present: log in / log out doesn't change anything
// true       - is logged in
// false      - is logged out
let initialState;
let currentState;
const stateChangeNotifications = [];

export function getVisitorAuthentication() {
  initializeStatesIfNecessary();

  return initialState === true;
}

function initializeStatesIfNecessary() {
  if (initialState !== undefined) {
    return;
  }

  if (Scrivito.isEditorLoggedIn()) {
    initialState = "disabled";
  } else {
    initialState = false;

    if (getVisitorIdentityProvider().handleReturnUrl()) {
      initialState = true;
      // some IdP libraries want us to remember that state
    } else if (localStorage.getItem(key) === "true") {
      getVisitorIdentityProvider().getSession();
      initialState = true;
    }
  }

  currentState = initialState;
}

export function login() {
  getVisitorIdentityProvider().login();
}

export function logout() {
  localStorage.removeItem(key);
  getVisitorIdentityProvider().logout();
}

export function onLoginStateChange(callback) {
  stateChangeNotifications.push(callback);
  initializeStatesIfNecessary();
  callback(currentState);

  return () => {
    const index = stateChangeNotifications.index(callback);
    if (index !== -1) {
      stateChangeNotifications.splice(index, 1);
    }
  };
}

let provider;

function getVisitorIdentityProvider() {
  if (provider) {
    return provider;
  }

  provider = getCognitoAuthWrapper();
  provider.onTokenSuccess(() => {
    currentState = true;
    localStorage.setItem(key, "true");
    // Note: raises an error if initialState === true (completely unexpected to be true)
    Scrivito.setVisitorIdToken(provider.getIdToken());
    // PisaLib.setIdToken(provider.getIdToken());
    stateChangeNotifications.forEach((callback) => callback());
  });

  provider.onTokenFailure(() => {
    currentState = false;
    localStorage.removeItem(key);
    // depends on whether provider already cleared previous state or not
    provider.logout();
    stateChangeNotifications.forEach((callback) => callback());
    if (initialState === true) {
      // TODO: probably clear any isReturnUrl indicators before
      window.location.reload();
    }
  });

  return provider;
}

function getCognitoAuthWrapper() {
  return new CognitoAuthWrapper({
    domain: process.env.AUTH_DOMAIN,
    clientId: process.env.AUTH_CLIENT_ID,
    redirectUri: `${window.location.origin}/`,
    userPoolId: process.env.AUTH_USER_POOL_ID,
  });
}
