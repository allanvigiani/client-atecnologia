import React, { useState, useEffect } from "react";
import styles from "@/styles/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const { email, token } = router.query;

    const generateError = (err) =>
        toast.error(err, {
            position: "bottom-right",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.trim() === "") {
            setErrorMessage("O campo de senha não pode estar vazio.");
        } else {
            setErrorMessage("");
            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH_LOCAL}/auth/reset-password`,
                    { email: email, token: token, password: password }
                );

                if (data.message.success) {
                    const response = data.message.success;
                    toast.success(response);

                    setTimeout(() => {
                        router.push("/login");
                    }, 4000);
                }
            } catch (err) {
                if (err.response && err.response.data) {
                    const apiError = err.response.data;

                    generateError(
                        apiError.message ||
                        "Ocorreu um erro ao processar a troca de senha. Tente novamente."
                    );
                } else {
                    generateError(
                        "Ocorreu um erro ao processar a troca de senha. Tente novamente."
                    );
                }
            }
        }
    };

    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>ATecnologia - Redefinir Senha</title>
            </Head>
            <div className={`${styles.container}`}>
                <div className={`${styles.main__login}`}>
                    <div className={`${styles.left__login}`}>
                        <h1>
                            Redefinir Senha
                        </h1>
                        <img
                            src={`/images/server.svg`}
                            className={`${styles.left__image}`}
                            alt="reset-password-animation"
                        />
                    </div>
                    <div className={`${styles.right__login}`}>
                        <div className={`${styles.wrap__login}`}>
                            <form
                                onSubmit={(e) => handleSubmit(e)}
                                className={`${styles.right__form}`}
                            >
                                <span className={`${styles.right__form__title}`}>
                                    REDEFINIR SENHA
                                </span>
                                <div className={`${styles.wrap__input}`}>
                                    <input
                                        className={`${styles.input}`}
                                        type="password"
                                        value={password}
                                        name="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        className={`${styles.focus__input}`}
                                        data__placeholder="Nova Senha"
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
