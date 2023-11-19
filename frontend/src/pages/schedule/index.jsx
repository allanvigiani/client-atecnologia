import React, { useState, useEffect } from "react";
import styles from "@/styles/Schedule.module.css";
import Layout from "../../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import { deleteCookie, hasCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function Schedule() {
  const router = useRouter();

  useEffect(() => {
    remove({ start_time: "", end_time: "" });
    append({ start_time: "", end_time: "" });

    const verifyUser = async () => {
      if (!hasCookie("user_auth_information")) {
        router.push("/login");
      } else {
        const Token = getCookie("user_auth_information");

        const config = {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        };
      }
    };
    verifyUser();
  }, []);

  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  });
  const [values, setValues] = useState({
    name: "",
    professional_name: "",
    price: "",
    start_time: "",
    end_time: "",
  });
  const [valor, setValor] = useState("");

  const formatarCampo = (e) => {
    const inputElement = e.target;
    const inputValue = inputElement.value;

    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;

    const valorNumerico =
      parseFloat(inputValue.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    const valorFormatado = valorNumerico.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    });

    setValor(valorFormatado);

    const novaPosicaoCursorStart =
      cursorStart + (valorFormatado.length - inputValue.length);
    const novaPosicaoCursorEnd =
      cursorEnd + (valorFormatado.length - inputValue.length);

    inputElement.setSelectionRange(
      novaPosicaoCursorStart,
      novaPosicaoCursorEnd
    );
  };

  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie("user_auth_information");

      const { data } = await axios.post(
        "http://localhost:3003/service/",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message.success) {
        const response = data.message.success;
        toast.success(response);
      }
    } catch (err) {
      console.error(err)
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
                        name="start_time"
                        {...register(`times.${index}.start_time`)}
                        required
                        onChange={(e) => {
                          setValues({
                            ...values,
                            start_time: e.target.value,
                          });
                        }}
                        placeholder="08:00"
                      />
                      <span>Hora Fim:</span>
                      <input
                        type="time"
                        name="end_time"
                        {...register(`times.${index}.end_time`)}
                        required
                        onChange={(e) => {
                          setValues({
                            ...values,
                            end_time: e.target.value,
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
        </div>
      </>
    </Layout>
  );
}
