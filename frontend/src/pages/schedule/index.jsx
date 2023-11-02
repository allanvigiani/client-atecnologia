import React, { useState, useEffect } from "react";
import styles from "@/styles/Schedule.module.css";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../components/Layout";

export default function Schedule() {
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

    // Obtenha a posição do cursor antes da formatação
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;

    // Remova todos os caracteres não numéricos e substitua ',' por '.'
    const valorNumerico =
      parseFloat(inputValue.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    // Formate o valor com 2 casas decimais e milhares separados por vírgula
    const valorFormatado = valorNumerico.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    });

    // Defina o novo valor formatado
    setValor(valorFormatado);

    // Restaure a posição do cursor
    const novaPosicaoCursorStart =
      cursorStart + (valorFormatado.length - inputValue.length);
    const novaPosicaoCursorEnd =
      cursorEnd + (valorFormatado.length - inputValue.length);

    inputElement.setSelectionRange(
      novaPosicaoCursorStart,
      novaPosicaoCursorEnd
    );
  };

  useEffect(() => {
    remove({ start_time: "", end_time: "" });
    append({ start_time: "", end_time: "" });
  }, []);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Layout>
      <>
        <div className={`${styles.container}`}>
          <div className={`${styles.title}`}>CADASTRAR SERVIÇO</div>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  value={valor}
                  {...register("price")}
                  required
                  onChange={formatarCampo}
                  placeholder="Ex: 500"
                />
              </div>
              <div className={`${styles.input__box}`}></div>
              {fields.map((field, index) => (
                <div key={field.id}>
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
                        onClick={() => append({ start_time: "", end_time: "" })}
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
        </div>
      </>
    </Layout>
  );
}
