import React, { useState, useEffect } from "react";
import styles from "@/styles/Navbar.module.css";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Navbar() {
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const router = useRouter();

  const logIn = async (e) => {
    router.push("/register");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>ATecnologia</title>
      </Head>
        <header
          className={`${styles.header} ${isNavbarVisible ? "" : styles.hidden}`}
        >
          <h2 className={`${styles.logo}`}>Logo</h2>
          <nav className={`${styles.navigation}`}>
            <a href="#">Inicio</a>
            <a href="#">Sobre</a>
            <a href="#">Contatos</a>
            <button
              className={`${styles.btn__Login}`}
              onClick={(event) => {
                logIn();
              }}
            >
              Participe
            </button>
          </nav>
        </header>
    </>
  );
}
