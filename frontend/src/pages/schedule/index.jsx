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
import CurrencyInput from 'react-currency-input-field';
import { Button } from "@mui/material";

export default function Schedule() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [services, setServices] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [serviceValue, setServiceValue] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [professionalName, setProfessionalName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [serviceDay, setServiceDay] = useState([]);
  const [serviceDayValue, setServiceDayValue] = useState([]);
  const [serviceDayValueEdit, setServiceDayValueEdit] = useState([]);
  const [serviceHour, setServiceHour] = useState([]);
  const [serviceHourValue, setServiceHourValue] = useState([]);
  const [serviceHourValueEdit, setServiceHourValueEdit] = useState([]);
  const [servicetypeId, setServicetypeId] = useState('');
  const [serviceLabel, setServiceLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [optionServiceDay, setOptionServiceDay] = useState([]);
  const [optionServiceHour, setOptionServiceHour] = useState([]);
  const [optionServiceOptions, setOptionServiceOptions] = useState([]);

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

      const { data: allInformation } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/all-informations/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const serviceDays = allInformation.message.days.map(day => ({
        id: day.id,
        description: day.description
      }));

      const serviceHours = allInformation.message.hours.map(hour => ({
        id: hour.id,
        start_time: hour.start_time
      }));

      const serviceOptions = allInformation.message.types.map(type => ({
        id: type.id,
        type: type.type
      }));

      setOptionServiceDay(serviceDays);
      setOptionServiceHour(serviceHours);
      setOptionServiceOptions(serviceOptions);
      setServices(serviceData.message.result);

      serviceHours.map((hour) => {
        serviceHourValue.push(hour.id);
      });

      serviceDays.map((day) => {
        serviceDayValue.push(day.id);
      });

      setLoading(false);
    } catch (error) {
      console.error("Erro na solicitação GET:", error);
      setLoading(false); // Ensure loading state is reset in case of error
    }
  };

  const clearForm = () => {
    setServiceName('');
    setServiceDescription('');
    setProfessionalName('');
    setPrice('');
    setServiceValue('');
    setServiceDayValue([]);
    setServiceHourValue([]);
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
      formErrors.serviceValue = 'Tipo de serviço é obrigatório';
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

      const cleanedPrice = price.replace(/[^\d,]/g, '').replace(',', '.');
      const formattedPrice = parseFloat(cleanedPrice);

      if (isNaN(formattedPrice)) {
        throw new Error('Preço inválido');
      }

      const formData = {
        name: serviceName,
        professional_name: professionalName,
        price: formattedPrice.toFixed(2),
        service_type_id: serviceValue,
        other_service_type: serviceDescription,
        service_hours_id: serviceHourValue.length === 0 ? serviceHour : serviceHourValue,
        service_days_id: serviceDayValue.length === 0 ? serviceDay : serviceDayValue
      };

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
      handleCloseCreateModal();
    } catch (err) {
      setFormLoading(false);
      generateError(err.response?.data?.message || err.message);
    }
  };

  const handleEditModal = async (service) => {
    setLoading(true);

    if (!hasCookie("user_auth_information")) {
      router.push("/login");
      setLoading(false);
      return;
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

      let numberPrice = parseFloat(service.price);
      const cleanPrice = numberPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      let formattedPrice = '';

      try {

        if ((cleanPrice)) {
          formattedPrice = cleanPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        } else {
          throw new Error('Preço inválido');
        }
      } catch (err) {
        console.error('Erro na formatação do preço:', err);
        formattedPrice = 'Erro na formatação'; 
      }

      setCompanyId(companyId);
      setServiceId(service.id);
      setServiceName(service.name);
      setServiceDescription(service.other_service_type);
      setProfessionalName(service.professional_name);
      setPrice(formattedPrice);
      setServiceValue(servicetype.message.result[0].id);
      setServicetypeId(servicetype.message.result[0].id);
      setServiceLabel(servicetype.message.result[0].type);
      setServiceDay(serviceDayEntries);
      setServiceHour(serviceHoursEntries);


      const idsHours = Object.entries(hoursOnService).map(subArray => subArray[0]);
      setServiceHourValueEdit(idsHours);

      const idsDays = Object.entries(daysOnService).map(subArray => subArray[0]);
      setServiceDayValueEdit(idsDays);

      setShowUpdateModal(true);
    } catch (err) {
      setLoading(false);
      generateError(err.response?.data?.message);
    }
  };

  const handleShowCreateModal = async (e) => {
    e.preventDefault();
    setLoading(true);
    await verifyUser();
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = async () => {
    await verifyUser();
    setShowCreateModal(false);
    setFormLoading(false);
    clearForm();
  };

  const handleCloseUpdateModal = async () => {
    await verifyUser();
    setFormLoading(false);
    setLoading(false);
    clearForm();
    setShowUpdateModal(false);
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

  const onUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setLoading(true);
    try {
      if (!hasCookie("user_auth_information")) {
        router.push("/login");
        return;
      }

      let numberPrice = parseFloat(price.replace(',', '.'));
      
      if (isNaN(numberPrice)) {
        throw new Error('Preço inválido');
      }

      const cleanPrice = numberPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      let formattedPrice = '';

      try {
        if (cleanPrice) {
          formattedPrice = numberPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        } else {
          throw new Error('Preço inválido');
        }
      } catch (err) {
        console.error('Erro na formatação do preço:', err);
        formattedPrice = 'Erro na formatação'; 
      }

      const formData = {
        id: serviceId,
        company_id: companyId,
        name: serviceName,
        professional_name: professionalName,
        price: numberPrice.toFixed(2),
        service_type_id: serviceValue,
        other_service_type: serviceDescription,
        service_hours_id: serviceHourValueEdit,
        service_days_id: serviceDayValueEdit
      };

      const token = getCookie("user_auth_information");

      const { data } = await axios.put(
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
      await handleCloseUpdateModal();
      setFormLoading(false);
    } catch (err) {
      setFormLoading(false);
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
            <button onClick={handleShowCreateModal} className={styles['form-button-modal']}>Novo Serviço</button>
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
        {/* Modal de Criação */}
        <Modal
          open={showCreateModal}
          onClose={handleCloseCreateModal}
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
                  <h2 className={`${styles.details_name}`}>Preencha as Informações</h2>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Nome:</span>
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
                    <span className={`${styles.details}`}>Tipo:</span>
                    <Select
                      name="serviceValue"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      options={optionServiceOptions && Array.isArray(optionServiceOptions) ? optionServiceOptions.map(option => ({
                        value: option.id,
                        label: option.type
                      })) : []}
                      onChange={(selectedOption) => setServiceValue(selectedOption.value)}
                    />
                    {errors.serviceValue && (
                      <FormHelperText error>{errors.serviceValue}</FormHelperText>
                    )}
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Profissional:</span>
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
                    <CurrencyInput
                      variant="outlined"
                      label="Preço"
                      fullWidth
                      margin="normal"
                      name="price"
                      value={price}
                      prefix="R$ "
                      groupSeparator="."
                      decimalSeparator=","
                      onValueChange={(value) => setPrice(value)}
                      error={!!errors.price}
                      helperText={errors.price}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Dia(s):</span>
                    <Select
                      isMulti
                      name="week_service"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      defaultValue={optionServiceDay && Array.isArray(optionServiceDay) ? optionServiceDay.map(option => ({
                        value: option.id,
                        label: option.description
                      })) : []}
                      options={optionServiceDay && Array.isArray(optionServiceDay) ? optionServiceDay.map(option => ({
                        value: option.id,
                        label: option.description
                      })) : []}
                      onChange={(serviceDay) => setServiceDayValue(serviceDay.map(option => option.value))}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Horário(s):</span>
                    <Select
                      isMulti
                      name="hour_service"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      defaultValue={optionServiceHour && Array.isArray(optionServiceHour) ? optionServiceHour.map(option => ({
                        value: option.id,
                        label: option.start_time
                      })) : []
                      }
                      options={optionServiceHour && Array.isArray(optionServiceHour) ? optionServiceHour.map(option => ({
                        value: option.id,
                        label: option.start_time
                      })) : []}
                      onChange={(serviceHour) => setServiceHourValue(serviceHour.map(option => option.value))}
                    />
                  </div>
                  <button type="submit" className={styles['form-button-modal']}>Novo Serviço</button>
                </>
              )}
            </form>
          </Box>
        </Modal>

        {/* Modal de Atualização */}
        <Modal
          open={showUpdateModal}
          onClose={handleCloseUpdateModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={styles.modalContent}>
            <form onSubmit={onUpdate} className={styles['form-modal']}>
              {formLoading ? (
                <div className={styles.loadingContainer}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <h2 className={`${styles.details_name}`}>Atualizar Serviço</h2>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Nome:</span>
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
                    <span className={`${styles.details}`}>Tipo:</span>
                    <Select
                      name="serviceValue"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      options={optionServiceOptions && Array.isArray(optionServiceOptions) ? optionServiceOptions.map(option => ({
                        value: option.id,
                        label: option.type
                      })) : []}
                      defaultValue={{ value: servicetypeId, label: serviceLabel }}
                      onChange={(selectedOption) => setServiceValue(selectedOption.value)}
                    />
                    {errors.serviceValue && (
                      <FormHelperText error>{errors.serviceValue}</FormHelperText>
                    )}
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Profissional:</span>
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
                    <CurrencyInput
                      variant="outlined"
                      label="Preço"
                      fullWidth
                      margin="normal"
                      name="price"
                      value={price}
                      prefix="R$ "
                      groupSeparator="."
                      decimalSeparator=","
                      onValueChange={(value) => setPrice(value)}
                      error={!!errors.price}
                      helperText={errors.price}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Dia(s):</span>
                    <Select
                      isMulti
                      name="week_service"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      defaultValue={serviceDay.map(option => ({
                        value: option.id,
                        label: option.description
                      }))}
                      options={optionServiceDay && Array.isArray(optionServiceDay) ? optionServiceDay.map(option => ({
                        value: option.id,
                        label: option.description
                      })) : []}
                      onChange={(serviceDay) => setServiceDayValue(serviceDay.map(option => option.value))}
                    />
                  </div>
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Horário(s):</span>
                    <Select
                      isMulti
                      name="hour_service"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      defaultValue={serviceHour.map(option => ({
                        value: option.id,
                        label: option.start_time
                      }))}
                      options={optionServiceHour && Array.isArray(optionServiceHour) ? optionServiceHour.map(option => ({
                        value: option.id,
                        label: option.start_time
                      })) : []}
                      onChange={(serviceHour) => setServiceHourValue(serviceHour.map(option => option.value))}
                    />
                  </div>
                  <button type="submit" className={styles['form-button-modal']}>Atualizar</button>
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
