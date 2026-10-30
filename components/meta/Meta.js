import Head from "next/head";

// Page metadata for the builder. The same PNG serves as favicon and as the icon Safari uses
// when the page is added to the Dock (apple-touch-icon).
export default function Meta({ title, keywords, description }) {
  const icon = "/assets/logo.png";

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="icon" href={icon} />
      <link rel="apple-touch-icon" href={icon} />
      <title>{title}</title>
    </Head>
  );
}
