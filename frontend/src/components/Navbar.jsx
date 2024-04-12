import React, { useState, useEffect } from "react";
import styles from "@/styles/Navbar.module.css";
import { useRouter } from "next/router";
import { getCookie, hasCookie, deleteCookie } from "cookies-next";
import axios from "axios";

export default function Navbar() {
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [isSubMenuVisible, setSubMenuVisible] = useState(false); // Novo estado para controlar a visibilidade do submenu

  const verifyUser = async () => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    } else {
      await fetchData();
    }
  };

  const fetchData = async () => {
    const token = getCookie("user_auth_information");

    try {
      const { data: companyData } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanyName(companyData.message.name);
    } catch (error) {
      console.error("Erro na solicitação GET:", error);
    }
  };

  const handleConfiguracaoClick = async (e) => {
    e.preventDefault();

    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }
    await router.push("/configuracao/company");
  };

  const handleCadastroClick = async (e) => {
    e.preventDefault();

    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }
    await router.push("/schedule");
  };

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
    verifyUser();

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

  const toggleSubMenu = () => {
    setSubMenuVisible(!isSubMenuVisible);
  };
  return (
    <>
      <header
        className={`${styles.header} ${isNavbarVisible ? "" : styles.hidden}`}
      >
        <img className={`${styles.logo}`} src="/images/logo_navbar-removebg-preview.png"/>
        <nav className={`${styles.navigation}`}>
          <a href="/">Inicio</a>
          <a onClick={handleCadastroClick}>Cadastrar Serviços</a>
          <img
            src="/images/profile.png"
            alt="user"
            className={styles["user-pic"]}
            onClick={toggleSubMenu} // Adiciona o evento onClick para alternar a visibilidade do submenu
          />
          <div className={`${styles["sub-menu-wrap"]} ${isSubMenuVisible ? "" : styles.hiddenUser}`}>
            <div className={styles["sub-menu"]}>
              <div className={styles["user-info"]}>
                <img
                  src="/images/profile.png"
                  alt="user"
                  className={styles["img-dropdown"]}
                />
                <h3>{companyName}</h3>
              </div>
              <hr />
              <a className={styles["sub-menu-link"]}
                onClick={handleConfiguracaoClick}
              >
                <img src="/images/setting.png"
                  alt="configuracao"
                  className={styles["img-dropdown"]} />
                <p>Editar Informações</p>
                <span> &gt; </span>
              </a>
              <a className={styles["sub-menu-link"]}
                onClick={logOut}
              >
                <img src="/images/logout.png"
                  alt="deslogar"
                  className={styles["img-dropdown"]} />
                <p>Deslogar</p>
                <span> &gt; </span>
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
