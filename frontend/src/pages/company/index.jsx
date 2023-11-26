import React, { useState, useEffect } from "react";
import styles from "@/styles/Company.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";

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

          try {
            const { data: companyData } = await axios.get(
              "http://localhost:3002/company/",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setCompanyName(companyData.message.name);
            setCompanyInformation(companyData.message.email);

            const { data: serviceData } = await axios.get(
              `http://localhost:3003/service/scheduled-services/${companyData.message.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setServiceData(serviceData.message);
          } catch (error) {
            console.error("Erro na solicitação GET:", error);
          }
        };

        fetchData();
      }
    };
    verifyUser();
  }, []);

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
        {serviceData && serviceData.length > 0 ? (
          <div className={styles.home__grid}>
            <div className={styles.div__grid}>
              <table>
                <thead className={styles.thead__grid}>
                  <tr className={styles.tr__grid}>
                    <th>Nome Cliente</th>
                    <th>Funcionário</th>
                    <th>Hora Início</th>
                    <th>Hora Fim</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody__grid}>
                  {serviceData.map(
                    ({
                      id,
                      client_name,
                      professional_name,
                      start_time,
                      end_time,
                    }) => (
                      <tr key={id}>
                        <td>{client_name}</td>
                        <td>{professional_name}</td>
                        <td>{start_time?.slice(0, 5)}</td>
                        <td>{end_time?.slice(0, 5)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    </Layout>
  );
}
