import * as Scrivito from "scrivito";
import { wantsVisitorAuthentication } from './auth';

const config = {
  tenant: process.env.SCRIVITO_TENANT,
  visitorAuthentication: wantsVisitorAuthentication,
  unstable: { assetUrlBase: "http://localhost:8090/scrivito" },
};

if (process.env.SCRIVITO_ORIGIN) {
  config.origin = process.env.SCRIVITO_ORIGIN;
}

Scrivito.configure(config);
