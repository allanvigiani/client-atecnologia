import React, { useState, useEffect } from "react";
import styles from "@/styles/Navbar.module.css";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import axios from "axios";

export default function Navbar() {
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const router = useRouter();

  const logOut = async (e) => {
    try {
      const token = getCookie("user_auth_information");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/auth/logout/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message.success) {
        deleteCookie("user_auth_information");
        router.push("/");
      }
    } catch (error) {
      console.error(`Erro: ${error}`);
    }
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
      <header
        className={`${styles.header} ${isNavbarVisible ? "" : styles.hidden}`}
      >
        <h2 className={`${styles.logo}`}>Logo</h2>
        <nav className={`${styles.navigation}`}>
          <a href="/">Inicio</a>
          <a href="/schedule">Cadastrar Serviços</a>
          {/* <a href="#">Sobre</a>
          <a href="#">Contatos</a> */}
          <button
            className={`${styles.btn__Login}`}
            onClick={(event) => {
              logOut();
            }}
          >
            Deslogar
          </button>
        </nav>
      </header>
    </>
  );
}
