import React, { useState, useEffect } from "react";
import styles from "@/styles/Company.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Company() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyInformation, setCompanyInformation] = useState("");
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!hasCookie("user_auth_information")) {
        router.push("/login");
      } else {
        const fetchData = async () => {
          const token = getCookie("user_auth_information");

          const getCompanyData = () => {
            const data = localStorage.getItem("companyData");
            if (data) {
              return JSON.parse(data);
            }
            return null;
          };

          try {

            if (getCompanyData()) {
              const companyData = getCompanyData();
              setCompanyName(companyData.name);
              setCompanyInformation(companyData.email);

              const { data: serviceData } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/scheduled-services/${companyData.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setServiceData(serviceData.result);
            }

          } catch (error) {
            console.error("Erro na solicitação GET:", error);
          }
        };

        fetchData();
      }
    };
    verifyUser();
  }, []);

  const handleAcesss = async (status) => {
    if (status) {
      const token = getCookie("user_auth_information");

      if (!token) {
        router.push("/login");
      }

      const confirmed = window.confirm("Tem certeza que deseja aceitar esse agendamento?");
      if (confirmed) {
        try {

          const { data: statusUpdate } = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/scheduled-services/${status}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (statusUpdate.message.result) {
            toast.success(statusUpdate.message.result);
          }
        } catch (error) {
          toast.error("Erro ao confirmar serviço!");
        }
      } else {
        console.log('nao vai aceitar')
      }
    } if (!status) {
      console.log('cancelar')
    }
  }

  return (
    <Layout>
      <>
        <section className={styles.home}>
          <div className={styles.container}>
            <h1>{companyName}</h1>
            <p>{companyInformation}</p>
          </div>
          <div className={styles.media__icons}>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i>
                <FaFacebook />
              </i>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i>
                <FaInstagram />
              </i>
            </a>
          </div>
        </section>
        <div className={styles['container-middle']}>
          <div className={styles['container-middle-grid']}>
            <div className={styles['container-titles']}>
              <h1>agendamento feitos whatever</h1>
              <hr />
            </div>
            <div className={styles['container-middle-grid-schedules']}>
              <div className={styles['day-month-year']}>15<br />10/2024
              </div>
              <span className={styles['schedule-text']}>SERVIÇO SEI LA OQUE to testando até aonde vai isso aqui sem quebraraqiui ainda continua o testaaaaaaaaaquebour agora foi</span>
              <img src="/images/adicionar.png" alt="Imagem do serviço" onClick={() => handleAcesss(true)} />
              <img src="/images/circulo-cruzado.png" alt="Imagem do serviço" onClick={() => handleAcesss(false)} />
            </div>
          </div>
        </div>
        <div className={styles['container-middle']}>
          <div className={styles['container-middle-grid']}>
            <div className={styles['container-titles']}>
              <h1>agendamento feitos whatever</h1>
              <hr />
            </div>
            <div className={styles['container-middle-grid-schedules']}>
              <div className={styles['day-month-year']}>15<br />10/2024
              </div>
              <span className={styles['schedule-text']}>SERVIÇO SEI LA OQUE to testando até aonde vai isso aqui sem quebraraqiui ainda continua o testaaaaaaaaaquebour agora foi</span>
            </div>
            <hr />
            <div className={styles['container-middle-grid-schedules']}>
              <div className={styles['day-month-year']}>15<br />10/2024
              </div>
              <span className={styles['schedule-text']}>SERVIÇO SEI LA OQUE to testando até aonde vai isso aqui sem quebraraqiui ainda continua o testaaaaaaaaaquebour agora foi</span>
            </div>
            <hr />
            <div className={styles['container-middle-grid-schedules']}>
              <div className={styles['day-month-year']}>15<br />10/2024
              </div>
              <span className={styles['schedule-text']}>SERVIÇO SEI LA OQUE to testando até aonde vai isso aqui sem quebraraqiui ainda continua o testaaaaaaaaaquebour agora foi</span>
            </div>
            <hr />
          </div>
        </div>
      </>
    </Layout>
  );
}
