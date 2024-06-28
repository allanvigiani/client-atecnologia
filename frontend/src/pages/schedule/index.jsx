import React, { useState, useEffect } from "react";
import styles from "@/styles/Schedule.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { deleteCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import Select from 'react-select';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { EditNote, Cancel } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import ptBR from "../../components/DataGrid";

const serviceDays = [
  { id: 1, description: 'Segunda-feira' },
  { id: 2, description: 'Terça-feira' },
  { id: 3, description: 'Quarta-feira' },
  { id: 4, description: 'Quinta-feira' },
  { id: 5, description: 'Sexta-feira' },
  { id: 6, description: 'Sábado' },
  { id: 7, description: 'Domingo' },
];

const serviceHours = [
  { id: 1, start_time: '07:00:00' },
  { id: 2, start_time: '08:00:00' },
  { id: 3, start_time: '09:00:00' },
  { id: 4, start_time: '10:00:00' },
  { id: 5, start_time: '11:00:00' },
  { id: 6, start_time: '12:00:00' },
  { id: 7, start_time: '13:00:00' },
  { id: 8, start_time: '14:00:00' },
  { id: 9, start_time: '15:00:00' },
  { id: 10, start_time: '16:00:00' },
  { id: 11, start_time: '17:00:00' },
  { id: 12, start_time: '18:00:00' },
  { id: 13, start_time: '19:00:00' },
  { id: 14, start_time: '20:00:00' },
  { id: 15, start_time: '21:00:00' },
  { id: 16, start_time: '22:00:00' },
];

export default function Schedule() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serviceValue, setServiceValue] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [professionalName, setProfessionalName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [serviceDay, setServiceDay] = useState([]);
  const [serviceDayValue, setServiceDayValue] = useState([]);
  const [serviceHour, setServiceHour] = useState([]);
  const [serviceHourValue, setServiceHourValue] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [servicetypeId, setServicetypeId] = useState('');
  const [serviceLabel, setServiceLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const columns = [
    { field: 'name', headerName: 'Serviços', flex: 0.5, align: 'center', headerAlign: 'center' },
    { field: 'professional_name', headerName: 'Profissional', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box display="flex" justifyContent="flex-end" width="100%">
          <IconButton className={styles.iconButton} onClick={async () => await handleEditModal(params.row)}>
            <EditNote />
          </IconButton>
          <IconButton className={`${styles.iconButton} ${styles.error}`} onClick={() => onDelete(params.row.id)}>
            <Cancel />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    verifyUser();

    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  const verifyUser = async () => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    } else {
      await fetchData();
    }
  };

  const fetchData = async () => {
    const token = getCookie("user_auth_information");
    setLoading(true);
    try {
      const { data: serviceData } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices(serviceData.message.result);
      setLoading(false);
    } catch (error) {
      console.error("Erro na solicitação GET:", error);
      setLoading(false); // Ensure loading state is reset in case of error
    }
  };

  const clearForm = () => {
    setServiceName('');
    setProfessionalName('');
    setPrice('');
    setServiceValue('');
    setServiceDescription('');
    setServiceDayValue([]);
    setServiceHourValue([]);
    setShowModal(false);
    setIsUpdating(false);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let formErrors = {};

    if (!serviceName) {
      formErrors.serviceName = 'Nome do serviço é obrigatório';
    }
    if (!professionalName) {
      formErrors.professionalName = 'Nome do profissional é obrigatório';
    }
    if (!price) {
      formErrors.price = 'Preço é obrigatório';
    }
    if (!serviceValue) {
      formErrors.serviceValue = 'Serviço é obrigatório';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setFormLoading(false);
      return;
    }

    try {
      if (!hasCookie("user_auth_information")) {
        router.push("/login");
      }

      if (serviceHourValue.length === 0) {
        serviceHour.map((hour) => {
          serviceHourValue.push(hour.id);
        });
      }

      if (serviceDayValue.length === 0) {
        serviceDay.map((day) => {
          serviceDayValue.push(day.id);
        });
      }

      const formData = {
        name: serviceName,
        professional_name: professionalName,
        price: price,
        service_type_id: serviceValue,
        other_service_type: serviceDescription,
        service_hours_id: serviceHourValue.length === 0 ? serviceHour : serviceHourValue,
        service_days_id: serviceDayValue.length === 0 ? serviceDay : serviceDayValue
      };

      if (isUpdating) {
        await onUpdate(serviceId);
        return;
      }

      const token = getCookie("user_auth_information");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = data.message;
      toast.success(response);
      clearForm();
      setFormLoading(false);
      handleCloseModal();
    } catch (err) {
      setFormLoading(false);
      generateError(err.response?.data?.message);
    }
  };

  const handleEditModal = async (service) => {
    setLoading(true);
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
      setLoading(false);
    }
    const id = parseInt(service.id);
    const companyId = parseInt(service.company_id);

    try {
      const token = getCookie("user_auth_information");

      const { data: servicetype } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/types/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceHours } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/hours/client/${id}/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceDays } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/days/${id}/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const CompanyData = getCookie("companyData");
      if (!CompanyData) {
        const token = getCookie("user_auth_information");

        const { data: companyData } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompanyName(companyData.name);
      }
      const daysOnService = serviceDays.message;
      const serviceDayEntries = Object.entries(daysOnService).map(([id, description]) => ({
        id: parseInt(id),
        description: description
      }));

      const hoursOnService = serviceHours.message;
      const serviceHoursEntries = Object.entries(hoursOnService).map(([id, startTime]) => ({
        id: parseInt(id),
        start_time: startTime
      }));

      const companyData = JSON.parse(CompanyData);

      setCompanyId(companyData.id);
      setServiceId(service.id);
      setServiceName(service.name);
      setServiceDescription(service.other_service_type);
      setProfessionalName(service.professional_name);
      setPrice(service.price);
      setServiceOptions(servicetype.message.result);
      setServicetypeId(servicetype.message.result[0].id);
      setServiceLabel(servicetype.message.result[0].type);
      setServiceDay(serviceDayEntries);
      setServiceHour(serviceHoursEntries);

      setIsUpdating(true);
      setShowModal(true);
    } catch (err) {
      setLoading(false);
      generateError(err.response?.data?.message);
    }
  };

  const handleShowModal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsUpdating(false);
    await verifyUser();
    setShowModal(true);
  };

  const handleCloseModal = async () => {
    setShowModal(false);
  };

  const handleCloseModalUpdate = async () => {
    await verifyUser();
    setShowModal(false);
  };

  const formatarCampo = (e) => {
    if (e.target.name === "price") {
      const price = e.target.value.replace(/[^\d$,]/g, "");
      e.target.value = price;

      const formattedPrice = `$ ${price}`.replace(
        /(\d{3})(?=(\d{3})*($|$))/,
        "$1,"
      );

      return formattedPrice;
    }
  };

  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  const onDelete = async (itemId) => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }

    try {
      setLoading(true);
      const token = getCookie("user_auth_information");

      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = data.message;
      toast.success(response);
      clearForm();
      await verifyUser();
      setLoading(false);
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  const onUpdate = async (itemId) => {
    try {
      const token = getCookie("user_auth_information");
      const formData = {
        id: itemId,
        company_id: companyId,
        name: serviceName,
        professional_name: professionalName,
        price: price,
        service_type_id: servicetypeId,
        other_service_type: serviceDescription,
        service_hours_id: serviceHourValue,
        service_days_id: serviceDayValue
      };

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await data.message;
      toast.success(response);
      clearForm();
      handleCloseModalUpdate();
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  return (
    <Layout>
      <>
        <div className={styles.container}>
          {loading && (
            <div className={styles.loadingContainer}>
              <CircularProgress />
            </div>
          )}
          <div className={styles.form}>
            <button onClick={handleShowModal} className={styles['form-button']}>Novo Serviço</button>
            <Box sx={{ height: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <DataGrid
                rows={services}
                columns={columns}
                pageSize={5}
                {...services}
                initialState={{
                  ...services.initialState,
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                pagination
                localeText={ptBR}
                sx={{ width: '100%', height: 400, margin: '10px 0' }}
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        </div>
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={styles.modalContent}>
            <form onSubmit={handleSubmit} className={styles['form-modal']}>
              {formLoading ? (
                <div className={styles.loadingContainer}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <h2 className={`${styles.details}`}>{isUpdating ? 'Atualizar Serviço' : 'Adicionar Serviço'}</h2>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Nome do Serviço:</span>
                    <TextField
                      type="text"
                      name="service_name"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      error={!!errors.serviceName}
                      helperText={errors.serviceName}
                      fullWidth={true}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Serviço:</span>
                    <Select
                      name="serviceValue"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      options={serviceOptions && Array.isArray(serviceOptions) ? serviceOptions.map(option => ({
                        value: option.id,
                        label: option.type
                      })) : []}
                      defaultValue={isUpdating ? { value: servicetypeId, label: serviceLabel } : null}
                      onChange={(selectedOption) => setServiceValue(selectedOption.value)}
                    />
                    {errors.serviceValue && (
                      <FormHelperText error>{errors.serviceValue}</FormHelperText>
                    )}
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Funcionário:</span>
                    <TextField
                      type="text"
                      name="professional_name"
                      value={professionalName}
                      onChange={(e) => setProfessionalName(e.target.value)}
                      error={!!errors.professionalName}
                      helperText={errors.professionalName}
                      fullWidth={true}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Preço:</span>
                    <TextField
                      type="text"
                      name="price"
                      value={price}
                      onChange={(e) => {
                        formatarCampo(e);
                        setPrice(e.target.value);
                      }}
                      error={!!errors.price}
                      helperText={errors.price}
                      placeholder="Ex: 500"
                      fullWidth={true}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Dia dos serviços:</span>
                    <Select
                      isMulti
                      name="week_service"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      defaultValue={serviceDay ? serviceDay.map(option => ({
                        value: option.id,
                        label: option.description
                      })) : (serviceDays ? serviceDays.map(option => ({
                        value: option.id,
                        label: option.description
                      })) : [])}
                      options={serviceDays && Array.isArray(serviceDays) ? serviceDays.map(option => ({
                        value: option.id,
                        label: option.description
                      })) : []}
                      onChange={(serviceDay) => setServiceDayValue(serviceDay.map(option => option.value))}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Hora dos serviços:</span>
                    <Select
                      isMulti
                      name="hour_service"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      defaultValue={serviceHour ? serviceHour.map(option => ({
                        value: option.id,
                        label: option.start_time
                      })) : (serviceHours ? serviceHours.map(option => ({
                        value: option.id,
                        label: option.start_time
                      })) : [])}
                      options={serviceHours && Array.isArray(serviceHours) ? serviceHours.map(option => ({
                        value: option.id,
                        label: option.start_time
                      })) : []}
                      onChange={(serviceHour) => setServiceHourValue(serviceHour.map(option => option.value))}
                    />
                  </div>
                  <button type="submit" className={styles['form-button-modal']}>
                    {isUpdating ? 'Atualizar Serviço' : 'Adicionar Serviço'}
                  </button>
                </>
              )}
            </form>
          </Box>
        </Modal>
        <ToastContainer />
      </>
    </Layout>
  );
}
