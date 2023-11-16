import React, { useState, useEffect } from "react";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

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
      <header
        className={`${styles.header} ${isNavbarVisible ? "" : styles.hidden}`}
      >
        <h2 className={`${styles.logo}`}>Logo</h2>
        <nav className={`${styles.navigation}`}>
          <a href="/">Inicio</a>
          {/* <a href="#">Sobre</a>
          <a href="#">Contatos</a> */}
          <button className={`${styles.btn__Login}`}>Deslogar</button>
        </nav>
      </header>
    </>
  );
};
