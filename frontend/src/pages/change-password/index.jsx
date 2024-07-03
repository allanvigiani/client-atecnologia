import React, { useState, useEffect } from "react";
import styles from "@/styles/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ChangePassword() {
    const [emailStyle, setEmailStyle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [randomValue, setRandomValue] = useState(Math.random());

    const [values, setValues] = useState({
        email: "",
    });

    const generateError = (err) =>
        toast.error(err, {
            position: "bottom-right",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;

        if (email.trim() === "") {
            setErrorMessage("O campo de e-mail não pode estar vazio.");
        } else {
            setErrorMessage("");
            try {

                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH_LOCAL}/auth/send-email-password`,
                    { email }
                );

                if (data.message.success) {
                    const response = data.message.success;
                    toast.success(response);

                    router.push("/login");
                }
            } catch (err) {
                if (err.response && err.response.data) {
                    const apiError = err.response.data;

                    generateError(
                        apiError.message ||
                        "Ocorreu um erro ao processar a recuperação de senha. Tente novamente."
                    );
                } else {
                    generateError(
                        "Ocorreu um erro ao processar a recuperação de senha. Tente novamente."
                    );
                }
            }
        }
    };

    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>AgendAí - Recuperar Senha</title>
            </Head>
            <div className={`${styles.container}`}>
                <div className={`${styles.main__login}`}>
                    <div className={`${styles.left__login}`}>
                        <h1>
                            Esqueceu sua senha?
                        </h1>
                        <img
                            src={`/images/forgot-password-animate.svg?${randomValue}`}
                            className={`${styles.left__image}`}
                            alt="recover-password-animation"
                        />
                    </div>
                    <div className={`${styles.right__login}`}>
                        <div className={`${styles.wrap__login}`}>
                            <form
                                onSubmit={(e) => handleSubmit(e)}
                                className={`${styles.right__form}`}
                            >
                                <span className={`${styles.right__form__title}`}>
                                    Digite seu e-mail
                                </span>
                                <div className={`${styles.wrap__input}`}>
                                    <input
                                        className={`${emailStyle !== ""
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
                                <div className={`${styles.error__message}`}>
                                    {errorMessage}
                                </div>
                                <div className={`${styles.container__right__form__btn}`}>
                                    <button
                                        type="submit"
                                        className={`${styles.right__form__btn}`}
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <div className={`${styles.text__center}`}>
                                    <span className={`${styles.text__create}`}>
                                        Lembrou sua senha?
                                    </span>
                                    <a
                                        href="/login"
                                        className={`${styles.text__create__ancora}`}
                                    >
                                        Fazer Login
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
