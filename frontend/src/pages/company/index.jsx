import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Cancel } from "@mui/icons-material";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { hasCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import styles from "@/styles/Company.module.css";
import ptBR from "../../components/DataGrid";

function Company() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInformation, setCompanyInformation] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      field: 'date',
      headerName: 'Data',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Serviço',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'start_time',
      headerName: 'Horário',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box display="flex" justifyContent="flex-end" width="100%">
          <IconButton className={styles.iconButton} onClick={() => handleAcesss(params.row.id, true)}>
            <CheckCircle />
          </IconButton>
          <IconButton className={`${styles.iconButton} ${styles.error}`} onClick={() => handleAcesss(params.row.id, false)}>
            <Cancel />
          </IconButton>
        </Box>
      ),
    },
  ];

  const columns_show = [
    {
      field: 'date',
      headerName: 'Data',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Serviço',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'description',
      headerName: 'Dia da semana',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'start_time',
      headerName: 'Horário',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center'
    },
  ];

  useEffect(() => {
    const verifyUser = async () => {
      if (!hasCookie("user_auth_information")) {
        router.push("/login");
        return;
      }

      await fetchData();
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getCookie("user_auth_information");

        const companyData = await getCompanyData(token);
        setCompanyData(companyData);

        const serviceData = await getServiceData(token, companyData.id);
        setServiceData(serviceData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const getCompanyData = async (token) => {
      const CompanyData = getCookie("companyData");

      if (CompanyData) {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCookie("companyData", data.message);
        return data.message;
      }

      return JSON.parse(CompanyData);
    };

    const setCompanyData = (companyData) => {
      setCompanyId(companyData.id);
      setCompanyName(companyData.name);
      setCompanyInformation(companyData.address);
    };

    const getServiceData = async (token, companyId) => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE_STATUS}/appointments/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data.message.map((service) => {
        const date = new Date(service.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        return { ...service, date: formattedDate };
      });
    };

    verifyUser();
  }, []);

  const handleAcesss = async (id, status) => {
    const token = getCookie("user_auth_information");

    if (!token) {
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(`Tem certeza que deseja ${status ? "aceitar" : "cancelar"} esse agendamento?`);
    if (confirmed) {
      try {
        const { data: statusUpdate } = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/scheduled-services/${id}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (statusUpdate.message.result) {
          toast.success(statusUpdate.message.result);
          // Atualizar o estado do serviço após a alteração
          setServiceData((prevData) =>
            prevData.map((service) =>
              service.id === id ? { ...service, status } : service
            )
          );
        }
      } catch (error) {
        toast.error("Erro ao confirmar serviço!");
      }
    }
  };

  return (
    <Layout>
      <>
        <section className={styles.home}>
          <div className={styles.container}>
            <Typography variant="h1" gutterBottom>
              {companyName}
            </Typography>
            <Typography variant="h7" gutterBottom>
              {companyInformation}
            </Typography>
          </div>
          <div className={styles.media__icons}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <i>
                <FaFacebook />
              </i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <i>
                <FaInstagram />
              </i>
            </a>
          </div>
        </section>
        <div className={styles['container-middle']}>
          <Box sx={{ height: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Confirmação de Agendamento
            </Typography>
            <DataGrid
              rows={serviceData}
              columns={columns}
              pageSize={5}
              {...serviceData}
              initialState={{
                ...serviceData.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              rowsPerPageOptions={[5, 10, 25]}
              loading={loading}
              pagination
              localeText={ptBR}
              sx={{ width: '70%', height: 400, margin: '10px 0' }}
              disableRowSelectionOnClick
            />
          </Box>
        </div>
        <div className={styles['container-middle']}>
          <Box sx={{ height: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Próximos Agendamentos
            </Typography>
            <DataGrid
              rows={serviceData}
              columns={columns_show}
              pageSize={5}
              {...serviceData}
              initialState={{
                ...serviceData.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              loading={loading}
              pagination
              localeText={ptBR}
              sx={{ width: '70%', height: 400, margin: '10px 0' }}
              disableRowSelectionOnClick
            />
          </Box>
        </div>
      </>
    </Layout>
  );
}

export default Company;