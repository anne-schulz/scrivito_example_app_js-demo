import * as Scrivito from "scrivito";

export const Image = Scrivito.provideObjClass("Image", {
  attributes: {
    author: "html",
    blob: "binary",
    tags: "stringlist",
    alternativeText: "string",
  },
});
