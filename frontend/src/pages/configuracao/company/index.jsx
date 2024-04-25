import React, { useState, useEffect } from "react";
import styles from "@/styles/Configuracao.module.css";
import Layout from "../../../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { deleteCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { set } from "react-hook-form";


export default function ConfiguracaoCompany() {
    const router = useRouter();
    const [companyId, setCompanyId] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');

    const storeCompanyData = (data) => {
        localStorage.setItem("companyData", JSON.stringify(data));
    };


    const getCompanyData = () => {
        const data = localStorage.getItem("companyData");
        if (data) {
            return JSON.parse(data);
        }
        return null;
    };

    useEffect(() => {
        verifyUser();
    }, []);

    const verifyUser = async () => {
        if (!hasCookie("user_auth_information")) {
            router.push("/login");
        } else {
            await fetchData();
        }
    };

    const fetchData = async () => {
        const token = getCookie("user_auth_information");

        if (!token) {
            router.push("/login");
        }

        try {

            const companyData = getCompanyData();
            if (!companyData) {
                const { data: companyData } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setCompanyId(companyData.id);
                setCompanyName(companyData.name);
                setCompanyEmail(companyData.email);
                setCompanyAddress(companyData.address);
                return;
            }
            setCompanyId(companyData.id);
            setCompanyName(companyData.name);
            setCompanyEmail(companyData.email);
            setCompanyAddress(companyData.address);
        } catch (error) {
            console.error("Erro na solicitação GET:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (!hasCookie("user_auth_information")) {
                router.push("/login");
            }

            const formData = {
                id: companyId,
                name: companyName,
                email: companyEmail,
                address: companyAddress,
            };

            const token = getCookie("user_auth_information");

            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const response = data.message;
            toast.success(response, {
                position: "bottom-right",
            });

            const { data: companyData } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            storeCompanyData(companyData);
        } catch (err) {
            generateError(err.response?.data?.message);
        }
    };

    const generateError = (err) =>
        toast.error(err, {
            position: "bottom-right",
        });

    return (
        <Layout>
            <>
                <div className={styles.container}>
                    <div className={styles.modal}>
                        <div className={styles['container-modal']}>
                            <form onSubmit={handleSubmit} className={styles['form-modal']}>
                                <h2 className={`${styles.details}`}>{'Atualizar dados da Empresa'}</h2>
                                <div className={`${styles.input__box}`}>
                                    <span className={`${styles.details}`}>Nome do Serviço:</span>
                                    <input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                                <div className={`${styles.input__box}`}>
                                    <span className={`${styles.details}`}>Email da Empresa:</span>
                                    <input
                                        type="email"
                                        name="companyEmail"
                                        id="companyEmail"
                                        value={companyEmail}
                                        onChange={(e) => setCompanyEmail(e.target.value)}
                                    />
                                </div>
                                <div className={`${styles.input__box}`}>
                                    <span className={`${styles.details}`}>Endereço da Empresa:</span>

                                    <input
                                        type="text"
                                        name="companyAddress"
                                        id="companyAddress"
                                        value={companyAddress}
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className={styles['form-button-modal']}>
                                    {'Atualizar Dados'}
                                </button>
                                <ToastContainer />
                            </form>
                        </div>
                    </div>
                </div>
            </>
        </Layout >
    );
}

