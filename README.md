# ATecnologia - SaaS de Agendamento ![version](https://img.shields.io/badge/version-0.1-blue)

## Por que a criação do projeto?

O projeto foi desenvolvido para compôr a avaliação das disciplinas de Labotarório de Desenvolvimento de Aplicativos Híbridos, Planos de Negócios e Arquitetura e Projetos de Software.

Nosso sitema é baseada na ideia de Sofware as a Service (Software como serviço) que é uma forma de distribuição e comercialização de software. No modelo SaaS, o fornecedor do software se responsabiliza por toda a estrutura necessária à disponibilização do sistema, e o cliente utiliza o software via internet, pagando um valor pelo serviço.

## Componentes da realização do projeto.

- Allan Vigiani Ferreira Costa - 202010792
- Thony da Cunha Silva - 202010797

### Tecnologias utilizadas.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) 
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

### Arquitetura.

Utilizamos a arquitetura de microserviços.

Microserviços: 
- auth
- company
- schedule
- schedule-confirmation

### TDD.

### APIs.

Toda documentação das APIs está disponível nas seguintes rotas após a incialização do projeto:
- Auth - ```http://localhost:3001/auth-api-docs```
- Company - ```http://localhost:3002/company-api-docs```
- Schedule - ```http://localhost:3003/schedule-api-docs```

### Modelagem do banco de dados.
![image](https://github.com/allanvigiani/ATecnologia/assets/64793591/351fb9b8-91c0-4027-93b5-546673992da4)

## Instale na sua máquina.

Clone o repositório:
```sh
git clone https://github.com/allanvigiani/ATecnologia.git
```
Entre na pasta do projeto
```sh
cd ATecnologia
```
Configure os .env do projeto e após isso inicialize o projeto utlizando o Docker Compose
```sh
sudo docker-compose up
```
