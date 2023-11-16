import React from "react";
import styles from "@/styles/Footer.module.css";

export default function Footer() {
  return (
    <>
    <div className={`${styles.footer}`}>
      <div className={`${styles.section__padding}`}>
        {/* <div className={`${styles.links}`}>
          <div className={`${styles.links_div}`}>
            <h4> For Business</h4>
            <a href="/employer">
              <p>Employer</p>
            </a>
          </div>
          <div className={`${styles.links_div}`}>
            <h4> For Business</h4>
            <a href="/employer">
              <p>Employer</p>
            </a>
          </div>
          <div className={`${styles.links_div}`}>
            <h4> For Business</h4>
            <a href="/employer">
              <p>Employer</p>
            </a>
          </div>
          <div className={`${styles.links_div}`}>
            <h4> For Business</h4>
            <div className={`${styles.socialmedia}`}>
              <p>
                <img></img>
              </p>
            </div>
          </div>
        </div> */}
        <hr></hr>

        <div className={`${styles.below}`}>
          <div className={`${styles.copyright}`}>
            <p>
              &copy; {new Date().getFullYear()} ATecnologia. Todos os direitos
              reservados.
            </p>
          </div>
          <div className={`${styles.below__links}`}>
            <a href="/terms">
              <div>
                <p>Termos & Condições</p>
              </div>
            </a>
            <a href="/privacy">
              <div>
                <p>Privacidade</p>
              </div>
            </a>
            <a href="/security">
              <div>
                <p>Segurança</p>
              </div>
            </a>
            <a href="/cookies">
              <div>
                <p>Cookies</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
