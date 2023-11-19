import React, { useState, useEffect } from "react";
import styles from "@/styles/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { deleteCookie, hasCookie, getCookie } from "cookies-next";

export default function Login() {
  useEffect(() => {
    const verifyUser = async () => {
      if (hasCookie("user_auth_information")) {
        router.push("/company");
      }
    };
    verifyUser();

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [emailStyle, setEmailStyle] = useState("");
  const [passwordStyle, setPasswordStyle] = useState("");
  const [passwordStrengthMessage, setErrorMessage] = useState("");
  const [randomValue, setRandomValue] = useState(Math.random());
  const router = useRouter();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleBeforeUnload = () => {
    setRandomValue(Math.random());
  };

  const isPassword = (password) => {
    const minLength = 5;
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*]/.test(password);
    let message = "";

    if (password.length < minLength) {
      message = "\nA Senha deve ter pelo menos 6 caracteres.";
    }

    return message ? message : false;
  };

  const handlePasswordStrength = () => {
    const password = passwordStyle;
    const isStrong = isPassword(password);

    if (!isStrong) {
      setErrorMessage("");
    } else {
      setErrorMessage(isStrong);
    }
  };

  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const isStrong = isPassword(password);

    if (email.trim() === "") {
      setErrorMessage("O campo de e-mail não pode estar vazio.");
    } else if (password.trim() === "") {
      setErrorMessage("O campo de senha não pode estar vazio.");
    } else {
      if (!isStrong) {
        setErrorMessage("");
        try {
          const { data } = await axios.post(
            "http://localhost:3001/auth/login/",
            { ...values }
          );

          if (data.message.success) {
            const response = data.message.success;
            toast.success(response);

            setCookie("user_auth_information", data.message.token);
            router.push("/");
          }
        } catch (err) {
          if (err.response && err.response.data) {
            const apiError = err.response.data;

            generateError(
              apiError.message ||
                "Ocorreu um erro ao processar o registro. Tente novamente."
            );
          } else {
            generateError(
              "Ocorreu um erro ao processar o registro. Tente novamente."
            );
          }
        }
      } else {
        setErrorMessage("A senha não atende aos critérios de força.");
      }
    }
  };

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.main__login}`}>
        <div className={`${styles.left__login}`}>
          <h1>
            {" "}
            Acesse sua conta <br /> para continuar
          </h1>
          <img
            src={`/images/server.svg?${randomValue}`}
            className={`${styles.left__image}`}
            alt="login-animation"
          />{" "}
        </div>
        <div className={`${styles.right__login}`}>
          <div className={`${styles.wrap__login}`}>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className={`${styles.right__form}`}
            >
              <span className={`${styles.right__form__title}`}>LOGIN</span>
              <span className={`${styles.right__form__title}`}>
                <img src="" alt="" />
              </span>
              <div className={`${styles.wrap__input}`}>
                <input
                  className={`${
                    emailStyle !== ""
                      ? `${styles.has__val} ${styles.input}`
                      : `${styles.input}`
                  }`}
                  type="email"
                  value={emailStyle}
                  name="email"
                  onChange={(e) => {
                    setEmailStyle(e.target.value);
                    setValues({
                      ...values,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <span
                  className={`${styles.focus__input}`}
                  data__placeholder="E-mail"
                ></span>
              </div>
              <div className={`${styles.wrap__input}`}>
                <input
                  className={`${
                    passwordStyle !== ""
                      ? `${styles.has__val} ${styles.input}`
                      : `${styles.input}`
                  }`}
                  type="password"
                  value={passwordStyle}
                  name="password"
                  onChange={(e) => {
                    setPasswordStyle(e.target.value);
                    setValues({
                      ...values,
                      [e.target.name]: e.target.value,
                    });
                    handlePasswordStrength();
                  }}
                />
                <span
                  className={`${styles.focus__input}`}
                  data__placeholder="Senha"
                ></span>
              </div>
              <div className={`${styles.password__strength__message}`}>
                {passwordStrengthMessage}
              </div>
              <div className={`${styles.container__right__form__btn}`}>
                <button type="submit" className={`${styles.right__form__btn}`}>
                  Logar
                </button>
              </div>
              <div className={`${styles.text__center}`}>
                <span className={`${styles.text__create}`}>
                  Não possui conta?
                </span>
                <a
                  href="/register"
                  className={`${styles.text__create__ancora}`}
                >
                  Criar Conta
                </a>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
