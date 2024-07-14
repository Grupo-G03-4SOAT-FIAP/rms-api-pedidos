<img src="https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/raw/main/docs/img/bope-faca-na-carveira-knife-skull-logo.png" alt="BOPE" title="BOPE" align="right" height="60" />

# Restaurant Management System
## Microsserviço de Pedidos

[![Deploy to Amazon EKS](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/actions/workflows/deploy.yml/badge.svg)](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/actions/workflows/deploy.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)

Microsserviço de Pedidos do Sistema de Gestão de Restaurantes (RMS) desenvolvido pelo grupo *"BOPE"* G03 da turma 4SOAT para o Tech Challenge da [Pós Tech em Software Architecture da FIAP](https://postech.fiap.com.br/curso/software-architecture/).

▶️[Clique aqui para assistir à apresentação no YouTube!](https://www.youtube.com/watch?v=1Kjw_gMVvWk)

### O PROBLEMA

*Há uma lanchonete de bairro que está expandindo devido seu grande sucesso. Porém, com a expansão e sem um sistema de controle de pedidos, o atendimento aos clientes pode ser caótico e confuso. Por exemplo, imagine que um cliente faça um pedido complexo, como um hambúrguer personalizado com ingredientes específicos, acompanhado de batatas fritas e uma bebida. O atendente pode anotar o pedido em um papel e entregá-lo à cozinha, mas não há garantia de que o pedido será preparado corretamente.*

*Sem um sistema de controle de pedidos, pode haver confusão entre os atendentes e a cozinha, resultando em atrasos na preparação e entrega dos pedidos. Os pedidos podem ser perdidos, mal interpretados ou esquecidos, levando à insatisfação dos clientes e a perda de negócios.*

*Em resumo, um sistema de controle de pedidos é essencial para garantir que a lanchonete possa atender os clientes de maneira eficiente, gerenciando seus pedidos e estoques de forma adequada. Sem ele, expandir a lanchonete pode acabar não dando certo, resultando em clientes insatisfeitos e impactando os negócios de forma negativa.*

*Para solucionar o problema, a lanchonete irá investir em um sistema de autoatendimento de fast food, que é composto por uma série de dispositivos e interfaces que permitem aos clientes selecionar e fazer pedidos sem precisar interagir com um atendente.*

*— Fonte: [FIAP](https://www.fiap.com.br/)*

#### Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)

<br>

![overview-microsservicos](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/assets/5115895/8eabc62c-4381-45ce-a101-42883dd1f087)

## Executar a aplicação

1. Baixe e instale o Node.js em https://nodejs.org/en/download
2. Instale o CLI do NestJS através do comando `npm i -g @nestjs/cli`
3. Navegue até a pasta raiz do projeto usando o Terminal;
4. Faça uma cópia do arquivo `.env.template` com o nome `.env` e preencha as variáveis de ambiente dentro dele;
5. Execute o comando `npm install` para instalar os pacotes npm;
6. Execute o comando `docker-compose up -d db-pedidos` para iniciar o container do banco de dados;
7. Execute o comando `docker-compose up -d localstack` para iniciar o localstack;
8. Use o comando `npm run start` para iniciar a aplicação.
9. Acesse o Swagger em http://localhost:3002/swagger/

<details>

<summary>Como executar a aplicação usando o Docker Compose?</summary>

## Executar a aplicação usando o Docker Compose

1. Clone este repositório;
2. Navegue até a pasta raiz do projeto usando o Terminal;
3. Faça uma cópia do arquivo `.env.template` com o nome `.env` e preencha as variáveis de ambiente dentro dele;
4. Execute o comando `docker-compose up -d --build --force-recreate`
5. Acesse o Swagger em http://localhost:3002/swagger/

</details>

<details>

<summary>Como executar a aplicação usando o Kubernetes do Docker Desktop?</summary>

## Executar a aplicação usando o Kubernetes do Docker Desktop

1. Clone este repositório;
2. Navegue até a pasta raiz do projeto usando o Terminal;
3. Use o comando `docker build -t rms-api-pedidos:latest .` para gerar a imagem de container da aplicação;
4. Use o comando `kubectl apply -f k8s/development/postgres/namespace.yaml -f k8s/development/postgres/pvc-pv.yaml -f k8s/development/postgres/config.yaml -f k8s/development/postgres/secrets.yaml -f k8s/development/postgres/deployment.yaml -f k8s/development/postgres/service.yaml` para fazer deploy do banco de dados;
5. Use o comando `kubectl apply -f k8s/development/api/namespace.yaml -f k8s/development/api/config.yaml -f k8s/development/api/secrets.yaml -f k8s/development/api/deployment.yaml -f k8s/development/api/service.yaml -f k8s/development/api/hpa.yaml` para fazer deploy da aplicação;
6. Acesse o Swagger em http://localhost:3002/swagger/

> Para remover a aplicação do Kubernetes, use o comando `kubectl delete namespace rms`

#### Sobre os Secrets do Kubernetes

Em seu ambiente de desenvolvimento, por questão de segurança, abra os arquivos `/k8s/development/postgres/secrets.yaml` e `/k8s/development/api/secrets.yaml` na pasta `/k8s/development` e preencha os valores sensíveis manualmente.

> No ambiente de produção os Secrets do Kubernetes são gerenciados pelo AWS Secrets Manager.

Para mais informações visite a página [Boas práticas para secrets do Kubernetes](https://kubernetes.io/docs/concepts/security/secrets-good-practices/#avoid-sharing-secret-manifests).

</details>

<details>

<summary>Como testar o pagamento de pedidos através do QR Code do Mercado Pago?</summary>

## Instruções para testar o pagamento de pedidos através do QR Code do Mercado Pago

Para testar o pagamento de pedidos usando o QR Code do Mercado Pago siga o passo a passo disponível na documentação da [api-pagamentos](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pagamentos?tab=readme-ov-file#testar-o-pagamento-de-pedidos-atrav%C3%A9s-do-qr-code-do-mercado-pago).

</details>

## Banco de Dados

Entendemos que o modelo relacional é o que mais se adequa ao nosso problema de negócio, contexto atual e requisitos no Microsserviço de Pedidos. Leia mais sobre as motivações para adoção do modelo relacional no [Architectural Decision Record (ADR)](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/wiki/Decis%C3%A3o-de-Arquitetura-para-Banco-de-Dados-da-API-RMS).

<details>

<summary>Quais são os parâmetros da conexão e credenciais para acesso ao banco de dados PostgreSQL?</summary>

<br>

Você pode conectar-se a instância de banco de dados PostgreSQL usando o [pgAdmin](https://www.pgadmin.org/download/), o terminal através do [psql](https://www.postgresql.org/download/), ou qualquer outra IDE ou ferramenta compatível.

> Host: localhost\
> Porta: 5432 (padrão)\
> Usuário: pguser\
> Senha: pgpwd\
> DB name: rms

</details>

## Documentação

A documentação do projeto está disponível no [GitHub Wiki](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/wiki).

## SAGA

Padrão implementado: [Coreografia](https://microservices.io/patterns/data/saga.html)

<details>

<summary>Por que optamos por uma SAGA coreografada?</summary>

## SAGA Coreografada

Nossa aplicação é relativamente simples. Dada a simplicidade da nossa aplicação, no nosso cenário não corremos o risco de enfrentar problemas de dependências cíclicas, nem tampouco enfrentamos dificuldades em fazer o entendimento e o mapeamento de todos os membros envolvidos na SAGA, já que a nossa SAGA possui poucos membros. Sabendo disso, dado o nosso contexto, optamos pela SAGA coreografada, conforme recomendado por Chris Richardson no livro "[Microservices Patterns](https://www.amazon.com.br/Microservice-Patterns-examples-Chris-Richardson/dp/1617294543)", indo de encontro também a recomendação feita pelo professor durante as aulas.

</details>

![RMS_SAGA drawio](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/assets/5115895/51d9d7e4-6121-4bbb-b08e-a447f33e327a)
*Clique na imagem para ampliar.*

## Padrão Arquitetural

Architectural Pattern: [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) + [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)

![uml-clean-arch drawio](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-monolito/assets/5115895/c19b37cb-5d1a-4328-8611-f9321a95e068)
*Clique na imagem para ampliar.*

## Diagrama de arquitetura cloud

Cloud provider: AWS

![Diagrama de arquitetura cloud drawio](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-monolito/assets/5115895/7cf5b858-5c7e-47d6-9def-2cda7e470134)
*Clique na imagem para ampliar.*

## Como contribuir

Para contribuir com o projeto consulte o guia em [CONTRIBUTING.md](CONTRIBUTING.md)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Métricas de código

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-api-pedidos&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)

## Projetos relacionados

API Catálogo\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-catalogo

API de Pagamentos\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pagamentos

Amazon Cognito Lambda triggers\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-cognito-triggers

Infrastructure as code (IaC) com Terraform\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-iac

API de Privacidade\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-privacidade

## OWASP ZAP

#### Reports OWASP ZAP API Scan
Os reports de "antes" e "depois" encontram-se na pasta `/docs/zap-scanning-report`\
[Clique aqui para acessar](https://github.com/Grupo-G03-4SOAT-FIAP/rms-api-pedidos/tree/main/docs/zap-scanning-report)↗️

<details>

<summary>Como escanear a API usando o OWASP ZAP?</summary>

### ZAP - API Scan

Para escanear todos os endpoints da API em busca de vulnerabilidades siga o passo a passo abaixo.

1. Execute a aplicação usando o Docker Compose;
2. Execute o comando abaixo:
```bash
docker run --name zap --network host -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable zap-api-scan.py -t http://localhost:3002/swagger-json -f openapi -r report.html
```

> Substitua os parenteses em `$(pwd)` por chaves `${pwd}` no Windows.

O report em formato HTML será gerado no diretório atual.

[Clique aqui](https://www.zaproxy.org/docs/docker/api-scan/) para obter mais informações sobre o API Scan do ZAP.

</details>

## Requisitos

*Node.js v20.12.0 (LTS), Docker Desktop 24.0.6 e Kubernetes v1.28*\
*Pagamentos processados por Mercado Pago.*

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-api-pedidos)
