import React, { useState, useEffect } from "react";
import styles from "@/styles/Dynamic.module.css";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import PhoneInput from "react-phone-number-input/react-hook-form-input";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GiArchiveRegister } from "react-icons/gi";

export default function userDynamic() {
  const router = useRouter();
  const { nomeDinamico } = router.query;
  const { register, handleSubmit, control, reset } = useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [values, setValues] = useState({
    client_name: "",
    client_contact: "",
    client_email: "",
  });

  const onSubmit = (data, e, reset) => {
    const formData = {
      ...data,
      serviceId,
      companyId,
    };

    console.log(formData);

    reset();

    setValues({
      client_name: "",
      client_contact: "",
      client_email: "",
    });
    setServiceId("");
    setCompanyId("");
    setIsOpen(false);
  };

  return (
    <>
      <Layout>
        <section className={`${styles.home}`}>
          <div className={`${styles.container}`}>
            <h1> Nome Empresa</h1>
            <p>informações da empresa</p>
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
                <tr>
                  <td hidden> 1</td>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                  <td>
                    <span className={`${styles.btn__popup}`}>
                      <GiArchiveRegister
                        onClick={() => {
                          setIsOpen(true);
                          setServiceId(1);
                          setCompanyId(1);
                        }}
                      ></GiArchiveRegister>
                    </span>
                  </td>
                </tr>
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
