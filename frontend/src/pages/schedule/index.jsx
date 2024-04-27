import React, { useState, useEffect } from "react";
import styles from "@/styles/Schedule.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useForm, useFieldArray, set } from "react-hook-form";
import { deleteCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import Select from 'react-select';
import { RiDeleteBin2Line } from "react-icons/ri";

export default function Schedule() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDescriptionField, setShowDescriptionField] = useState(false);
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

  const getCompanyData = () => {
    const data = localStorage.getItem("companyData");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  };

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

    try {

      const companyDataFromStorage = getCompanyData();

      const { data: serviceData } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceDataHours } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/hours/all-hours`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceDataDays } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/days/all-days`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceDatatypes } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY_SERVICE}/types/all-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServiceOptions(serviceDatatypes.message.result);
      setServiceDay(serviceDataDays.message.result);
      setServiceHour(serviceDataHours.message.result);
      setServices(serviceData.message.result);
    } catch (error) {
      console.error("Erro na solicitação GET:", error);
    }
  };

  const clearForm = async () => {
    setServiceName('');
    setProfessionalName('');
    setPrice('');
    setServiceValue('');
    setServiceDescription('');
    setServiceDayValue([]);
    setServiceHourValue([]);
    setShowModal(false);
    setIsUpdating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (!hasCookie("user_auth_information")) {
        router.push("/login");
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
        onUpdate(serviceId);
        return;
      }

      const token = getCookie("user_auth_information");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/`,
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
      handleCloseModal();
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  const handleEditModal = async (service) => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }

    try {
      const token = getCookie("user_auth_information");

      const { data: servicetype } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/service/types/${service.service_type_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceHours } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/service/hours/${service.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: serviceDays } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/service/days/${service.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: companyData } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_COMPANY}/company/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanyId(companyData.message.id);
      setServiceId(service.id)
      setServiceName(service.name)
      setServiceDescription(service.other_service_type)
      setProfessionalName(service.professional_name)
      setPrice(service.price)
      setServiceOptions(servicetype.message.result);
      setServiceDay(serviceDays.message.result);
      setServiceHour(serviceHours.message.result);
      setServicetypeId(servicetype.message.result[0].id);
      setServiceLabel(servicetype.message.result[0].type);

      // setShowDescriptionField(service.)      
      setIsUpdating(true);
      setShowModal(true);
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  const handleShowModal = async (e) => {
    e.preventDefault();
    await verifyUser();
    setIsUpdating(false);
    setShowModal(true);
  };

  const handleCloseModal = async () => {
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
      const token = getCookie("user_auth_information");

      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = data.message;
      toast.success(response);
      clearForm();
      verifyUser();
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
        service_hours_id: serviceHourValue.length === 0 ? serviceHour : serviceHourValue,
        service_days_id: serviceDayValue.length === 0 ? serviceDay : serviceDayValue
      };

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await data.message;
      toast.success(response);
      clearForm()
      handleCloseModal();
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  return (
    <Layout>
      <>
        <div className={styles.container}>
          <div className={styles.form}>
            <button onClick={handleShowModal} className={styles['form-button']}>Novo Serviço</button>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles['table-header']}>Serviços</th>
                  <th className={styles['table-header']}>Profissional</th>
                  <th className={styles['table-header']}>Editar</th>
                  <th className={styles['table-header']}>Deletar</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className={styles['table-row']}>
                    <td className={styles['table-data']}>{service.name}</td>
                    <td className={styles['table-data']}>{service.professional_name}</td>
                    <td className={styles['table-data']}>
                      <button className={styles['table-button']}
                        onClick={() => {
                          handleEditModal(service);
                        }}>
                        Editar
                      </button>
                    </td>
                    <span className={`${styles['btn-popup']}`}>
                      <RiDeleteBin2Line
                        onClick={() => {
                          onDelete(service.id);
                        }}
                      ></RiDeleteBin2Line>
                    </span>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showModal && (
          <div className={styles.modal}>
            <div className={styles['container-modal']}>
              <form onSubmit={handleSubmit} className={styles['form-modal']}>
                <span className={styles.close} onClick={handleCloseModal}>&times;</span>
                <h2 className={`${styles.details}`}>{isUpdating ? 'Atualizar Serviço' : 'Adicionar Serviço'}</h2>
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Nome do Serviço:</span>
                  <input
                    type="text"
                    name="service_name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
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
                </div>
                {showDescriptionField && (
                  <div className={`${styles.input__box}`}>
                    <span className={`${styles.details}`}>Descreva:</span>
                    <textarea
                      name="service_description"
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      rows={2}
                      cols={40}
                    />
                  </div>
                )}
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Funcionário:</span>
                  <input
                    type="text"
                    name="professional_name"
                    value={professionalName}
                    onChange={(e) => setProfessionalName(e.target.value)}
                    required
                  />
                </div>
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Preço:</span>
                  <input
                    type="text"
                    name="price"
                    value={price}
                    onChange={(e) => {
                      formatarCampo(e);
                      setPrice(e.target.value);
                    }}
                    required
                    placeholder="Ex: 500"
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
                    })) : []}
                    options={serviceDay && Array.isArray(serviceDay) ? serviceDay.map(option => ({
                      value: option.id,
                      label: option.description
                    })) : []}
                    onChange={(serviceDay) => setServiceDayValue(serviceDay.map(option => option.value))} />
                </div>
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Hora dos serviços:</span>
                  <Select
                    isMulti
                    name="hour_service"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    defaultValue={serviceHour.length > 0 ? serviceHour.map(option => ({
                      value: option.id,
                      label: option.start_time
                    })) : []}
                    options={serviceHour && Array.isArray(serviceHour) ? serviceHour.map(option => ({
                      value: option.id,
                      label: option.start_time
                    })) : []}
                    onChange={(serviceHour) => setServiceHourValue(serviceHour.map(option => option.value))}
                  />
                </div>
                <button type="submit" className={styles['form-button-modal']}>
                  {isUpdating ? 'Atualizar Serviço' : 'Adicionar Serviço'}
                </button>
              </form>
              <ToastContainer />
            </div>
          </div>
        )}
      </>
    </Layout>
  );
}
