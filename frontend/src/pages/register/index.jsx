import React, { useState, useEffect } from "react";
import styles from "@/styles/Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function Register() {
  const [nomeStyle, setNomeStyle] = useState("");
  const [emailStyle, setEmailStyle] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [addressStyle, setAddressStyle] = useState("");
  const [passwordStyle, setPasswordStyle] = useState("");
  const [passwordStrengthMessage, setErrorMessage] = useState("");
  const [randomValue, setRandomValue] = useState(Math.random());
  const [values, setValues] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    setRandomValue(Math.random());
  };

  const isPassword = (password) => {
    const minLength = 5;
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

  const isEmailMatch = (email, confirmarEmail) => {
    return email === confirmarEmail;
  };

  const handleEmailMatch = () => {
    const match = isEmailMatch(emailStyle, confirmEmail);

    if (!match) {
      setErrorMessage("Os campos de E-mail e Confirmar E-mail não coincidem.");
    } else {
      setErrorMessage("");
    }
  };

  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const confirmEmail = e.target.elements.confirmEmail.value;
    const address = e.target.elements.address.value;
    const password = e.target.elements.password.value;
    const isStrong = isPassword(password);

    if (name.trim() === "") {
      setErrorMessage("O campo Nome da Empresa não pode estar vazio.");
    } else if (email.trim() === "") {
      setErrorMessage("O campo de E-mail não pode estar vazio.");
    } else if (confirmEmail.trim() === "") {
      setErrorMessage("O campo Confirmar E-mail não pode estar vazio.");
    } else if (email !== confirmEmail) {
      setErrorMessage("Os campos de E-mail e Confirmar E-mail não coincidem.");
    } else if (password.trim() === "") {
      setErrorMessage("O campo de senha não pode estar vazio.");
    } else if (address.trim() === "") {
      setErrorMessage("O campo de endereço não pode estar vazio.");
    } else {
      if (!isStrong) {
        setErrorMessage("");
        try {
          const { data } = await axios.post(
            "http://localhost:3002/company/",
            { ...values }
          );

          const responseData = data;
          toast.success(responseData);
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
    <>
      <div className={`${styles.container}`}>
        <div className={`${styles.main__login}`}>
          <div className={`${styles.left__login}`}>
            <h1>
              Registre-se e faça parte <br /> da nossa comunidade!
            </h1>
            <img
              src={`/images/mobile-login-animate.svg?${randomValue}`}
              className={`${styles.left__image}`}
              alt="register-animation"
            />
          </div>
          <div className={`${styles.right__login}`}>
            <div className={`${styles.wrap__login}`}>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className={`${styles.right__form}`}
              >
                <span className={`${styles.right__form__title}`}>
                  Cadastrar
                </span>
                <div className={`${styles.wrap__input}`}>
                  <input
                    className={`${
                      nomeStyle !== ""
                        ? `${styles.has__val} ${styles.input}`
                        : `${styles.input}`
                    }`}
                    type="name"
                    value={nomeStyle}
                    name="name"
                    onChange={(e) => {
                      setNomeStyle(e.target.value);
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      });
                    }}
                  />
                  <span
                    className={`${styles.focus__input}`}
                    data__placeholder="Nome da Empresa"
                  ></span>
                </div>
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
                      confirmEmail !== ""
                        ? `${styles.has__val} ${styles.input}`
                        : `${styles.input}`
                    }`}
                    type="email"
                    value={confirmEmail}
                    name="confirmEmail"
                    onChange={(e) => {
                      setConfirmEmail(e.target.value);
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      handleEmailMatch();
                    }}
                  />
                  <span
                    className={`${styles.focus__input}`}
                    data__placeholder="Confirmar E-mail"
                  ></span>
                </div>
                <div className={`${styles.wrap__input}`}>
                  <input
                    className={`${
                      addressStyle !== ""
                        ? `${styles.has__val} ${styles.input}`
                        : `${styles.input}`
                    }`}
                    type="text"
                    value={addressStyle}
                    name="address"
                    onChange={(e) => {
                      setAddressStyle(e.target.value);
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      });
                    }}
                  />
                  <span
                    className={`${styles.focus__input}`}
                    data__placeholder="Endereço da Empresa"
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
                  <button className={`${styles.right__form__btn}`}>
                    Registrar
                  </button>
                </div>
                <div className={`${styles.text__center}`}>
                  <span className={`${styles.text__create}`}>
                    Já possui conta?
                  </span>
                  <a href="/login" className={`${styles.text__create__ancora}`}>
                    Entrar
                  </a>
                </div>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
