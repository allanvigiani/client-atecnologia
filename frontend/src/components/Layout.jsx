import Header from "./Navbar.jsx";
import Footer from "./Footer.jsx";

import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>ATecnologia</title>
      </Head>
      <Header />
      <main> {children} </main>
      <Footer />
    </>
  );
};
