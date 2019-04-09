import * as Auth from "../auth/Auth";
import * as Scrivito from 'scrivito';

export let wantsVisitorAuthentication = Auth.getVisitorAuthentication(window.location,
  token => {
    Scrivito.setVisitorAuthentication(token);
  },
  () => {
    console.log('Configure dummy visitor authentication to start content loading');
    // if no token can be retrieved, try to load publicly available content
    Scrivito.setVisitorAuthentication('InvalidTokenButBetterThanNone');
  }
);

// `true` currently indicates a return url with a hash
if (wantsVisitorAuthentication === true) {
  Scrivito.finishLoading().then(() => {
    const page = Scrivito.currentPage();
    if (page) {
      Scrivito.navigateTo(page, { hash: null });
    }
  });
}

window.Auth = Auth;
