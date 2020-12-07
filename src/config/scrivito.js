import * as Scrivito from "scrivito";
import { getVisitorAuthentication } from "../Auth/VisitorIdentityProvider";

const config = {
  adoptUi: true,
  tenant: process.env.SCRIVITO_TENANT,
  visitorAuthentication: getVisitorAuthentication(),
};

if (process.env.SCRIVITO_ORIGIN) {
  config.origin = process.env.SCRIVITO_ORIGIN;
}

if (process.env.SCRIVITO_ENDPOINT) {
  config.endpoint = process.env.SCRIVITO_ENDPOINT;
}

Scrivito.configure(config);
