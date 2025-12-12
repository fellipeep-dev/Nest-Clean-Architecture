# 🚀 Nest Clean Architecture Template

Um template completo, escalável e profissional para a construção de APIs utilizando **NestJS**, focado em **Clean Architecture**, alta performance e organização.

Ideal para iniciar novos projetos com uma base sólida, desacoplada e preparada para o ambiente de produção. 

---

## 🧱 Tecnologias e Padrões de Design

A base deste projeto foi construída utilizando as seguintes tecnologias e padrões:

| Categoria | Tecnologia/Padrão | Descrição |
| :--- | :--- | :--- |
| **Framework** | **NestJS** | Framework Node.js para aplicações server-side escaláveis. |
| **Linguagem** | TypeScript | Garante tipagem estática e maior manutenibilidade. |
| **Arquitetura** | **Clean Architecture** | Separação clara de camadas e regras de negócio puras. |
| **Padrão** | **CQRS Module** | Command Query Responsibility Segregation (Leitura/Escrita). |
| **ORM** | **Prisma** | Moderno ORM Type-safe para acesso ao banco de dados. |
| **Banco de Dados** | **PostgreSQL 16** | Banco de dados relacional robusto. |
| **Cache/Mensageria** | **Redis 7** | Utilizado para cache de alta velocidade e escalabilidade. |
| **Containerização** | **Docker & Docker Compose** | Ambiente de desenvolvimento e produção isolado. |

---

## ⚙️ Configuração e Ambiente

### Variáveis de Ambiente

Para que a aplicação e os serviços funcionem corretamente, é necessário configurar as variáveis de ambiente.

* Crie um arquivo **`.env`** na raiz do projeto.
* Utilize o arquivo **`.env.example`** como base para garantir que todas as chaves necessárias (conexões de banco de dados, Redis, etc.) sejam definidas.

### 🐳 Docker Compose (Postgres + Redis + API)

O template foi desenvolvido para ser executado de forma isolada e consistente.

* O projeto inclui um **`Dockerfile`** para a aplicação NestJS e um **`docker-compose.yml`** completo.
* Este ambiente dockerizado já configura e orquestra todos os serviços necessários: a **API NestJS**, o **PostgreSQL** e o **Redis**. 
* Isso garante um ambiente de desenvolvimento e testes idêntico ao de produção.

---

## ▶️ Como Executar o Projeto

Para iniciar o projeto, a abordagem recomendada é utilizar o Docker Compose, que configura automaticamente todos os serviços necessários (API NestJS, PostgreSQL e Redis).

### 1. 🛠️ Pré-requisitos e Configuração

Certifique-se de ter o **Docker** e o **Docker Compose** instalados.

| Passo | Comando | Descrição |
| :--- | :--- | :--- |
| **Instalar Dependências** | `npm install` | Instala todos os pacotes Node.js/TypeScript. |
| **Configurar o Ambiente** | `cp .env.example .env` | Cria o arquivo `.env` de configuração na raiz do projeto. |

### 2. 🐳 Iniciar com Docker Compose (Recomendado)

Utilize este comando para construir a imagem da API e subir todos os contêineres em *background*:

```bash
docker compose up --build -d
```

### 3. 🔗 Acesso aos Serviços

Após executar a aplicação com `docker compose up`, você pode acessar os principais serviços e ferramentas nos seguintes endereços/comandos:

| Serviço | Acesso | Notas |
| :--- | :--- | :--- |
| **API NestJS** | `http://localhost:3000` | Endpoint base da aplicação. |
| **Prisma Studio** | `npx prisma studio` | Ferramenta visual para navegar e gerenciar os dados do banco. |

### 4. 💻 Execução Local (Apenas a API)

Se preferir rodar a API diretamente na sua máquina, assumindo que PostgreSQL e Redis já estejam acessíveis, utilize este comando:

```bash
npm run start:dev
```

---

## 📂 Estrutura do Projeto (Clean Architecture)

A arquitetura do projeto segue rigorosamente os princípios de **Clean Architecture**, garantindo **desacoplamento** entre as camadas e alta **manutenibilidade**. 

A organização principal das pastas reflete as responsabilidades de cada camada:

### 🌳 Visualização da Hierarquia

    src/
    ├── common/ # 🛠️ Código reutilizável (Helpers, Decorators, Pipes, Filters, etc.)
    │
    ├── domain/ # 💡 CORE DA APLICAÇÃO: Entidades, DTOs e regras de negócio puras.
    │
    ├── infra/ # ⚙️ INFRAESTRUTURA: Implementações concretas de tecnologias
    |   ├── database/prisma/ # Configuração do Prisma ORM e Cliente de Banco de Dados
    |   ├── redis/ # Provider para o serviço de Cache/Broker (Redis)
    |   └── health/ # Health Checks (Verificações de Liveness / Readiness)
    │
    └── modules/ # 📦 FEATURES: Agrupamento de funcionalidades por módulo (Ex: User)
        └── [feature-name]/
            ├── controllers/ # Camada de Interface (HTTP)
            ├── repositories/ # Interfaces de Repositório e Implementações específicas
            ├── services/ # Serviços e lógica específica da feature
            └── use-cases/ # Commands, Queries e Handlers (Padrão CQRS)

---

## 🧩 Sobre Cada Camada

Cada camada do projeto possui uma responsabilidade clara, seguindo o princípio da **Inversão de Dependência** da Clean Architecture. 

| Camada | Responsabilidade | Conteúdo Principal | Dependências |
| :--- | :--- | :--- | :--- |
| **`common/`** | Utilitários reutilizáveis para toda a aplicação. | Helpers, Decorators, Pipes, Filters, e códigos que não dependem de features específicas. | Nenhuma dependência do domínio ou infra. |
| **`domain/`** | **Regras de Negócio Puras.** O Core da Aplicação. | Entidades e DTOs que representam o estado e as regras do domínio. | Nenhuma dependência externa. |
| **`infra/`** | Implementações concretas de tecnologias. | **Prisma Client**, **Redis Provider**, **Health Checks** e implementação da Persistência de Dados. | Depende das tecnologias externas. |
| **`modules/`** | Funcionalidades Específicas (Features). | Contém o ciclo completo de uma feature, incluindo **Controller**, **Repository**, **Service** e **Use Cases (CQRS)**. | Depende de `domain/` e `infra/`. |

### Detalhamento das Camadas

#### **`domain/` (Domínio)**
É o centro da aplicação. Contém a **lógica pura** de negócio, livre de qualquer implementação tecnológica (como banco de dados ou framework).

#### **`infra/` (Infraestrutura)**
É a camada mais externa. Responsável por traduzir as interfaces definidas no domínio para implementações concretas (ex: como salvar uma Entidade usando o Prisma).

#### **`modules/` (Módulos de Feature)**
Agrupa toda a lógica de uma funcionalidade. É onde o **CQRS** é aplicado, orquestrando as operações de leitura e escrita através dos *Use Cases*.

---

## 🗃️ Prisma ORM & Banco de Dados

O projeto utiliza o **Prisma** como Object-Relational Mapper (ORM), garantindo tipagem segura e uma experiência de desenvolvimento moderna para interagir com o **PostgreSQL**.

### Comandos Essenciais

Com o banco de dados rodando (via Docker ou localmente), utilize o `npx prisma` para gerenciar o *schema* e os dados:

| Comando | Descrição |
| :--- | :--- |
| `npx prisma migrate dev` | **Criar/Aplicar Migrações:** Analisa o `schema.prisma`, gera uma nova migração e aplica as mudanças no banco de dados. |
| `npx prisma studio` | **Abrir Prisma Studio:** Inicia a interface gráfica para visualizar, explorar e gerenciar os dados em tempo real.  |
| `npx prisma generate` | **Gerar Cliente:** Gera o cliente Type-safe do Prisma após qualquer alteração no `schema.prisma`. |

---

## ⚡ Arquitetura CQRS (Command Query Responsibility Segregation)

O projeto adota o padrão **CQRS** para separar claramente as responsabilidades de leitura e escrita. Isso aumenta a escalabilidade, performance e manutenibilidade do código.

Todo o fluxo de lógica de negócio é implementado através de *Use Cases* organizados por módulo.

### Componentes Chave

| Componente | Responsabilidade | Tipo de Operação |
| :--- | :--- | :--- |
| **Commands** | Solicitações que alteram o estado da aplicação. | **Escrita** (Criação, Atualização, Exclusão). |
| **Queries** | Solicitações que apenas leem e recuperam dados. | **Leitura** (Busca por ID, Listagem). |
| **Handlers** | Classes que contêm a lógica de negócio e executam um *Command* ou *Query* específico. | Execução da Lógica. |
| **Use Cases** | Agrupamento de *Commands*, *Queries* e *Handlers* dentro de cada módulo. | Orquestração da Feature. |

### Exemplo de Estrutura por Módulo

A estrutura reflete a separação entre comandos e consultas dentro da pasta `use-cases/`:

    modules/
    └── user/
        └── use-cases/
            ├── commands/
            |   ├── create-user.command.ts # A Requisição para Criar
            |   └── create-user.handler.ts # A Lógica de Criação (Escrita)
            └── queries/
                ├── find-user.query.ts # A Requisição para Buscar
                └── find-user.handler.ts # A Lógica de Busca (Leitura)

---

## 🩺 Health Checks (Verificação de Saúde)

O projeto inclui *endpoints* padronizados para verificação de saúde, essenciais para o monitoramento da aplicação em ambientes de produção e em orquestradores como Kubernetes.

Estes *checks* garantem que a aplicação está não apenas rodando, mas também funcional e pronta para receber tráfego.

### Endpoints Padrão

| Health Check | Endpoint | Método | Função |
| :--- | :--- | :--- | :--- |
| **Liveness** | `/health/liveness` | `GET` | **Estado Vital:** Confirma se a aplicação está em execução. Se falhar, o contêiner deve ser reiniciado. |
| **Readiness** | `/health/readiness` | `GET` | **Prontidão para Tráfego:** Confirma se todas as dependências críticas (DB, Redis) estão conectadas e prontas para uso. |

Estes *checks* são utilizados automaticamente pelo **Docker Compose** durante seu processo de build, assegurando a alta disponibilidade.

---
