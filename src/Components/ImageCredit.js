import * as React from "react";
import * as Scrivito from "scrivito";

export const ImageCredit = Scrivito.connect(
  ({ image }) => {
    if (!image) { return null; }

    if (!image.get("author")) { return null; }

    return (
      <section>
        <Scrivito.ContentTag tag="div" className="author-bgc" content={image} attribute="author" />
      </section>
    );
  }
);
