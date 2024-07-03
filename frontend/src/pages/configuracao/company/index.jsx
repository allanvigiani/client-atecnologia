import React, { useState, useEffect } from "react";
import styles from "@/styles/Configuracao.module.css";
import Layout from "../../../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { deleteCookie, setCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { Button, Typography } from "@mui/material";
import InputMask from 'react-input-mask';

export default function ConfiguracaoCompany() {
    const router = useRouter();
    const [companyId, setCompanyId] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companyCnpj, setCompanyCnpj] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');

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
            const CompanyData = getCookie("companyData");

            if (!CompanyData) {
                const { data: companyData } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(companyData)
                setCompanyName(companyData.name);
                setCompanyEmail(companyData.email);
                setCompanyCnpj(companyData.cnpj ? companyData.cnpj : '123.123.123-12');
                setCompanyAddress(companyData.address);
                setCompanyPhone(companyData.contact_phone);
                setCompanyId(companyData.id);
                setCookie("companyData", JSON.stringify(companyData));
            } else {
                const companyData = JSON.parse(CompanyData);
                setCompanyId(companyData.id);
                setCompanyName(companyData.name);
                setCompanyEmail(companyData.email);
                setCompanyCnpj(companyData.cnpj ? companyData.cnpj : '123.123.123-13');
                setCompanyAddress(companyData.address);
                setCompanyPhone(companyData.contact_phone);
            }
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
                contact_phone: companyPhone,
            };
            console.log(formData);
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

            toast.success(data.message, {
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

            setCookie("companyData", companyData.message);
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
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '70vh', alignItems: 'center', mt: 4 }}>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexGrow: 1,
                            '& .MuiTextField-root': { m: 2, width: '50ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <Typography variant="h4" className={`${styles.details}`} gutterBottom>
                            Atualizar Informações
                        </Typography>

                        <TextField
                            disabled
                            label="Email:"
                            type="email"
                            name="companyEmail"
                            id="companyEmail"
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                        />

                        <TextField
                            disabled
                            label="CNPJ:"
                            type="cnpj"
                            name="companyCnpj"
                            id="companyCnpj"
                            value={companyCnpj}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                        />

                        <TextField
                            label="Razão Social/Nome Fantasia:"
                            type="text"
                            name="companyName"
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />

                        <TextField
                            label="Endereço:"
                            type="text"
                            name="companyAddress"
                            id="companyAddress"
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                        />

                        <InputMask
                            mask="(99) 99999-9999"
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                        >
                            {(inputProps) => <TextField
                                {...inputProps}
                                label="Telefone:"
                                type="text"
                                name="companyPhone"
                                id="companyPhone"
                            />}
                        </InputMask>

                        <button type="submit" className={styles['form-button-modal']}>Atualizar</button>
                    </Box>
                </Container>
            </React.Fragment>
            <ToastContainer />
        </Layout>
    );
}
