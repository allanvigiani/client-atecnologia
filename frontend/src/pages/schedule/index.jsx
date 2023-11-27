import React, { useState, useEffect } from "react";
import styles from "@/styles/Schedule.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import { deleteCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { RiDeleteBin2Line } from "react-icons/ri";

export default function Schedule() {
  const router = useRouter();
  const [serviceData, setServiceData] = useState([]);
  const { register, handleSubmit, control, reset } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  });
  const [values, setValues] = useState({
    name: "",
    professional_name: "",
    price: "",
  });

  useEffect(() => {
    remove({ start_time: "", end_time: "" });
    append({ start_time: "", end_time: "" });
    verifyUser();
  }, []);

  const verifyUser = async () => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    } else {
      fetchData();
    }
  };

  const fetchData = async () => {
    const token = getCookie("user_auth_information");

    try {
      const { data: serviceData } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/service/`,
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }

    try {
      const token = getCookie("user_auth_information");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/service/`,
        JSON.stringify(values),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = data.message;
      toast.success(response);

      await verifyUser();
      reset({
        name: "",
        professional_name: "",
        price: "",
        times: [{ start_time: "", end_time: "" }],
      });
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  const onDelete = async (itemId) => {
    if (!hasCookie("user_auth_information")) {
      router.push("/login");
    }

    try {
      const token = getCookie("user_auth_information");

      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_SCHEDULE}/service/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = data.message;
      toast.success(response);

      await verifyUser();
    } catch (err) {
      generateError(err.response?.data?.message);
    }
  };

  return (
    <Layout>
      <>
        <div className={`${styles.main}`}>
          <div className={`${styles.container}`}>
            <div className={`${styles.title}`}>CADASTRAR SERVIÇO</div>
            <form onSubmit={(e) => handleSubmit(onSubmit(e))}>
              <div className={`${styles.service__details}`}>
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Serviço:</span>
                  <input
                    type="text"
                    name="name"
                    {...register("name")}
                    required
                    onChange={(e) => {
                      setValues({
                        ...values,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Funcionário:</span>
                  <input
                    type="text"
                    name="professional_name"
                    {...register("professional_name")}
                    required
                    onChange={(e) => {
                      setValues({
                        ...values,
                        professional_name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className={`${styles.input__box}`}>
                  <span className={`${styles.details}`}>Preço:</span>
                  <input
                    type="text"
                    name="price"
                    {...register("price")}
                    required
                    onChange={(e) => {
                      formatarCampo(e);
                      setValues({
                        ...values,
                        price: e.target.value,
                      });
                    }}
                    placeholder="Ex: 500"
                  />
                </div>
                <div className={`${styles.input__box}`}></div>
                {fields.map((field, index) => (
                  <div className={`${styles.dinamic__field}`} key={field.id}>
                    <div className={`${styles.input__time}`}>
                      <span>Hora Inicio:</span>
                      <input
                        type="time"
                        name={`times[${index}].start_time`}
                        {...register(`times.${index}.start_time`)}
                        required
                        onChange={(e) => {
                          setValues((prevValues) => ({
                            ...prevValues,
                            times: [
                              ...(prevValues.times || []),
                              { start_time: e.target.value, end_time: "" },
                            ],
                          }));
                        }}
                        placeholder="08:00"
                      />
                      <span>Hora Fim:</span>
                      <input
                        type="time"
                        name={`times.${index}.end_time`}
                        {...register(`times.${index}.end_time`)}
                        required
                        onChange={(e) => {
                          setValues((prevValues) => {
                            const newTimes = [...(prevValues.times || [])];
                            newTimes[index] = {
                              ...newTimes[index],
                              end_time: e.target.value,
                            };
                            return { ...prevValues, times: newTimes };
                          });
                        }}
                        placeholder="17:00"
                      />
                      {index === fields.length - 1 ? (
                        <button
                          type="button"
                          className={`${styles.btn__image}`}
                          onClick={() =>
                            append({ start_time: "", end_time: "" })
                          }
                        >
                          <img
                            src={`/images/adicionar.png`}
                            alt="Adicionar"
                            className={`${styles.small__image}`}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.btn__image}`}
                          onClick={() => remove(index)}
                        >
                          <img
                            src={`/images/circulo-cruzado.png`}
                            alt="Remover"
                            className={`${styles.small__image}`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${styles.container__form__btn}`}>
                <button type="submit" className={`${styles.right__form__btn}`}>
                  Cadastrar serviço
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>
          <div className={`${styles.home__grid}`}>
            <div className={`${styles.div__grid}`}>
              {serviceData.length > 0 && (
                <table>
                  <thead className={`${styles.thead__grid}]`}>
                    <tr className={`${styles.tr__grid}`}>
                      <th>Serviço</th>
                      <th>Funcionário</th>
                      <th>Hora Início</th>
                      <th>Hora Fim</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`${styles.tbody__grid}`}>
                    {serviceData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.professional_name}</td>
                        <td>{item.start_time.slice(0, 5)}</td>
                        <td>{item.end_time.slice(0, 5)}</td>
                        <td>
                          <span className={`${styles.btn__popup}`}>
                            <RiDeleteBin2Line
                              onClick={() => {
                                onDelete(item.id);
                              }}
                            ></RiDeleteBin2Line>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}
