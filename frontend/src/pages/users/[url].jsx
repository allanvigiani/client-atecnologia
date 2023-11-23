import React, { useEffect, useState } from "react";
import styles from "@/styles/Dynamic.module.css";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import PhoneInput from "react-phone-number-input/react-hook-form-input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GiArchiveRegister } from "react-icons/gi";

export async function getStaticPaths() {
  try {
    const response = await fetch(
      "http://localhost:3002/company/all-companies/"
    );
    const data = await response.json();

    const paths = data.message.map((todo) => {
      return {
        params: {
          url: `${todo.url_name}`,
        },
      };
    });
    return { paths, fallback: true };
  } catch (error) {
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps(context) {
  const { params } = context;
  const data = await fetch(
    `http://localhost:3002/company/all-companies/${params.url}`
  );

  const todo = await data.json();EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

  return {
    props: { todo },
  };
}

export default function Users({ todo }) {
  const { register, handleSubmit, control, reset } = useForm();
  const [serviceData, setServiceData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [serviceIdHour, setServiceIdHour] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [values, setValues] = useState({
    client_name: "",
    client_contact: "",
    client_email: "",
    schedule_date: "",
  });

  useEffect(() => { 
    const verifyService = async () => {
      try {
        const { data: serviceData } = await axios.get(
          `http://localhost:3003/service/company-services/${todo.message.id}`
        );

        setServiceData(serviceData.message);
      } catch (error) {
        console.error("Erro na solicitação GET:", error);
      }
    };

    verifyService();
  }, []);

  const onSubmit = async (data, e, reset) => {
    e.preventDefault();

    const service_id = serviceId;
    const service_hour_id = serviceIdHour;

    const formData = {
      service_id,
      service_hour_id,
      ...data,
      companyId,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:3003/schedule/",
          formData, 
      );

    } catch (err) {
      console.error(err);
    }

    reset();

    setValues({
      client_name: "",
      client_contact: "",
      client_email: "",
    });
    setServiceIdHour("");
    setCompanyId("");
    setIsOpen(false);
  };

  return (
    <>
      <Layout>
        <section className={`${styles.home}`}>
          <div className={`${styles.container}`}>
            <h1> {todo.message.name}</h1>
            <p>{todo.message.address}</p>
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
                  <th hidden> Id </th>
                  <th>Nome Cliente</th>
                  <th>Funcionário</th>
                  <th>Hora Início</th>
                  <th>Hora Fim</th>
                  <th>Agendar</th>
                </tr>
              </thead>
              <tbody className={`${styles.tbody__grid}`}>
                {serviceData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.professional_name}</td>
                    <td>{item.start_time}</td>
                    <td>{item.end_time}</td>
                    <td>
                      <span className={`${styles.btn__popup}`}>
                        <GiArchiveRegister
                          onClick={() => {
                            setIsOpen(true);
                            setServiceId(item.id);
                            setServiceIdHour(item.service_id);
                            setCompanyId(todo.message.id);
                          }}
                        ></GiArchiveRegister>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal open={isOpen}>
          <main>
            <div className={`${styles.wrapper}`}>
              <span className={`${styles.icon__close}`}>
                <AiOutlineCloseCircle
                  onClick={() => setIsOpen(false)}
                ></AiOutlineCloseCircle>
              </span>
              <div className={`${styles.form__box}`}>
                <div className={`${styles.title}`}>FAÇA SEU AGENDAMENTO</div>
                <form
                  onSubmit={handleSubmit((data, e) => onSubmit(data, e, reset))}
                >
                  <div className={`${styles.service__details}`}>
                    <div className={`${styles.input__box}`}>
                      <span className={`${styles.details}`}>Nome:</span>
                      <input
                        type="text"
                        name="client_name"
                        {...register("client_name")}
                        required
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className={`${styles.input__box}`}>
                      <span className={`${styles.details}`}>Email:</span>
                      <input
                        type="email"
                        name="client_email"
                        {...register("client_email")}
                        required
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className={`${styles.input__box}`}>
                      <span className={`${styles.details}`}>Contato:</span>
                      <PhoneInput
                        name="client_contact"
                        control={control}
                        rules={{ required: true, maxLength: 14 }}
                        country="BR"
                      />
                    </div>
                    <div className={`${styles.input__box}`}>
                      <span className={`${styles.details}`}>Data:</span>
                      <input
                        type="date"
                        name="schedule_date"
                        {...register("schedule_date")}
                        required
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className={`${styles.container__form__btn}`}>
                    <button
                      type="submit"
                      className={`${styles.right__form__btn}`}
                    >
                      Agendar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </Modal>
      </Layout>
    </>
  );
}
