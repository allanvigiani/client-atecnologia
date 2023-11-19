import React, { useState, useEffect } from "react";
import styles from "@/styles/Company.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { deleteCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

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
            const { data } = await axios.get("http://localhost:3002/company/", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCompanyName(data.message.name);
            setCompanyInformation(data.message.email);

            const { data: serviceData } = await axios.get(
              "http://localhost:3003/service/",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setServiceData(serviceData.message.result);
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
        <section className={`${styles.home}`}>
          <div className={`${styles.container}`}>
            <h1> {companyName}</h1>
            <p>{companyInformation}</p>
          </div>
          <div className={`${styles.media__icons}`}>
            <a href="https://www.facebook.com/" target="_blank">
              <i>
                <FaFacebook />
              </i>
            </a>
            <a href="https://www.instagram.com/" target="_blank">
              <i>
                <FaInstagram />
              </i>
            </a>
          </div>
        </section>
        <div className={`${styles.home__grid}`}>
          <div className={`${styles.div__grid}`}>
            <table>
              <thead className={`${styles.thead__grid}`}>
                <tr className={`${styles.tr__grid}`}>
                  <th>Nome Cliente</th>
                  <th>Funcionário</th>
                  <th>Hora Início</th>
                  <th>Hora Fim</th>
                </tr>
              </thead>
              <tbody className={`${styles.tbody__grid}`}>
                {serviceData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.professional_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    </Layout>
  );
}
