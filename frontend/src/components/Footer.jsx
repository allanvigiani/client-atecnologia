import React from "react";

const Footer = () => {
  return (
    <>
      <footer>
        <div>
          &copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos
          reservados.
        </div>
        {/* Adicione qualquer conteúdo adicional do rodapé aqui */}
      </footer>
    </>
  );
};

export default Footer;
