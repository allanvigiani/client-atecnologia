import React, { useState } from "react";
import styles from "@/styles/Company.module.css";
import Layout from "../../components/Layout";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Company() {
  return (
    <Layout>
      <>
        <section className={`${styles.home}`}>
          <div className={`${styles.container}`}>
            <h1> Nome Empresa</h1>
            <p>informações da empresa</p>
          </div>
          <div className={`${styles.media__icons}`}>
            <a
              href="https://www.facebook.com/"
              target="_blank"
            >
              <i>
                <FaFacebook />
              </i>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
            >
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
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>{" "}
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
                <tr>
                  <td> Allan</td>
                  <td> João</td>
                  <td> 11:00</td>
                  <td> 13:00</td>
                </tr>
                <tr>
                  <td> Thony</td>
                  <td> Pedro</td>
                  <td> 08:00</td>
                  <td> 10:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </Layout>
  );
}
