import React, { useState, useEffect } from "react";
import styles from "@/styles/Navbar.module.css";
import { useRouter } from "next/router";
import { getCookie, setCookie, hasCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import { Avatar, CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";

export default function Navbar() {
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const getCompanyData = () => {
    const data = localStorage.getItem("companyData");
    if (data) {
      setLoading(false);
      return JSON.parse(data);
    }
    return null;
  };

  const verifyUser = async () => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }
    await fetchData();
  };

  const fetchData = async () => {
    const CompanyData = getCookie("companyData");

    if (!CompanyData) {
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

        setCompanyName(companyData.name);
        setCookie("companyData", companyData.message);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Erro na solicitação GET:", error);
      }
    }
    const companyData = JSON.parse(CompanyData);
    setCompanyName(companyData.name);
    setLoading(false);
  };

  const handleConfiguracaoClick = async (e) => {
    e.preventDefault();

    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }
    setLoading(true);
    await router.push("/configuracao/company");
    setLoading(false);
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
        deleteCookie("companyData");
        router.push("/");
      }
    } catch (error) {
      console.error(`Erro: ${error}`);
    }
  };

  useEffect(() => {
    const companyDataFromStorage = getCompanyData();

    if (companyDataFromStorage) {
      setCompanyName(companyDataFromStorage.name);
    } else {
      verifyUser();
    }

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


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {loading && (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <header
        className={`${styles.header} ${isNavbarVisible ? "" : styles.hidden}`}
      >
        <img className={`${styles.logo}`} src="/images/logo_navbar-removebg-preview.png" />
        <nav className={`${styles.navigation}`}>
          <a href="/">Inicio</a>
          <a onClick={handleCadastroClick}>Cadastrar Serviços</a>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, ml: 4, bgcolor: '#e5e5e5', borderRadius: '50%' }}>
            <Avatar alt="user" src="/images/profile.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleConfiguracaoClick}>
              <Avatar
                src="/images/setting.png"
                sx={{ marginRight: 1 }}
              />
              Editar Informações
            </MenuItem>
            <MenuItem onClick={logOut}>
              <Avatar
                src="/images/logout.png"
                sx={{ marginRight: 1 }}
              />
              Deslogar
            </MenuItem>
          </Menu>
        </nav>
      </header>
    </>
  );
}
