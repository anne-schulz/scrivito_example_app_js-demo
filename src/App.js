import * as React from "react";
import * as Scrivito from "scrivito";
import { HelmetProvider } from "react-helmet-async";

import { CurrentPageMetadata } from "./Components/CurrentPageMetadata";
import { ErrorBoundary } from "./Components/ErrorBoundary";
import { Footer } from "./Components/Footer";
import { Navigation } from "./Components/Navigation";
import { NotFoundErrorPage } from "./Components/NotFoundErrorPage";

export const helmetContext = {};

export function App({ appWrapperRef }) {
  return (
    <HelmetProvider context={helmetContext}>
      <ErrorBoundary>
        <React.Suspense>
          <div ref={appWrapperRef}>
            <div className="content-wrapper">
              <Navigation />
              <div id="mainContent">
                <Scrivito.CurrentPage />
              </div>
              <Scrivito.NotFoundErrorPage>
                <NotFoundErrorPage />
              </Scrivito.NotFoundErrorPage>
            </div>
            <Footer />
            <CurrentPageMetadata />
          </div>
        </React.Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
