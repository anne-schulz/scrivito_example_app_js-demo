import Auth0 from 'auth0-js';

const auth0 = new Auth0.WebAuth({
  domain: 'scrivito-dev.eu.auth0.com',
  clientID: 'zoY0soXdjuZKnz1yevOemtqUSnxYQtVk',
  redirectUri: 'http://localhost:8080/',
  responseType: 'token id_token',
  // scope: 'openid profile email',
  scope: 'openid',
  leeway: 5,
});

let authenticationHandledListeners = [];
let tokenRetrievalFailedListeners = [];

export function notifyAuthenticationHandled(callback) {
  authenticationHandledListeners.push(callback);
}

function notifyTokenRetrievalFailed(callback) {
  tokenRetrievalFailedListeners.push(callback);
}


export function getVisitorAuthentication(location, deferredTokenCallback, failedTokenCallback) {
  let retrieveToken;

  const hash = location.hash;
  if (hash && hash.substr(0, 13) === '#access_token') {
    retrieveToken = handleAuthentication;
  } else if (isLoggedIn()) {
    retrieveToken = renewSession;
  }

  if (!retrieveToken) {
    return false;
  }

  notifyAuthenticationHandled(() => {
    deferredTokenCallback(getIdToken());
  });
  notifyTokenRetrievalFailed(() => {
    failedTokenCallback();
  });

  retrieveToken();

  return true;
}

let accessToken;
let idToken;
let expiresAt;

export function login(popup = true) {
  // auth0.popup.authorize();
  auth0.authorize();
}

export function logout() {
  // Remove tokens and expiry time
  accessToken = null;
  idToken = null;
  expiresAt = 0;

  // Remove isLoggedIn flag from localStorage
  localStorage.removeItem('isLoggedIn');

  auth0.logout({
    return_to: window.location.origin
  });
}

export function handleAuthentication() {
  auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult);
    } else if (err) {
      tokenRetrievalFailed();
      // redirect
      console.log(err);
      alert(`Error: ${err.error}. Check the console for further details.`);
    }
  });
}

export function getAccessToken() {
  return accessToken;
}

export function getIdToken() {
  return idToken;
}

export function setSession(authResult) {
  // Set isLoggedIn flag in localStorage
  localStorage.setItem('isLoggedIn', 'true');

  // Set the time that the access token will expire at
  accessToken = authResult.accessToken;
  idToken = authResult.idToken;
  expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();

  authenticationHandledListeners.forEach(callback => { callback(); });
  // redirect
}

export function renewSession() {
  auth0.checkSession({}, (err, authResult) => {
     if (authResult && authResult.accessToken && authResult.idToken) {
       setSession(authResult);
     } else if (err) {
       logout();
       tokenRetrievalFailed();
       console.log(err);
       alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
     }
  });
}

export function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

export function isAuthenticated() {
  return new Date().getTime() < expiresAt;
}

function tokenRetrievalFailed() {
  tokenRetrievalFailedListeners().forEach(callback => { callback(); });
}
