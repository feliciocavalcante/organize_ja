
<div align="center">
  <h1 align="center">Organize Já</h1>
  <p align="center">
    Um aplicativo web full-stack para gerenciamento de finanças pessoais, construído com React, Supabase e Tailwind CSS.
  </p>
</div>

<br />

## 📋 Tabela de Conteúdo
* [Sobre o Projeto](#-sobre-o-projeto)
* [✨ Principais Funcionalidades](#-principais-funcionalidades)
* [🚀 Telas do Projeto](#-telas-do-projeto)
* [🔧 Pilha de Tecnologia (Tech Stack)](#-pilha-de-tecnologia-tech-stack)
* [⚙️ Começando (Instalação)](#️-começando-instalação)
  * [Pré-requisitos](#pré-requisitos)
  * [Configuração do Frontend (React)](#configuração-do-frontend-react)
  * [Configuração do Backend (Supabase)](#configuração-do-backend-supabase)
* [🤖 Configurando o Bot do WhatsApp](#-configurando-o-bot-do-whatsapp)
* [📜 Licença](#-licença)
* [📧 Contato](#-contato)

---

## 📖 Sobre o Projeto

O **Organize Já** é uma aplicação SaaS (Software as a Service) completa, desenvolvida para ajudar usuários a tomar controle de suas vidas financeiras. O projeto foi construído do zero, implementando um sistema de autenticação seguro, um modelo de negócios "Freemium" com simulação de upgrade, e um dashboard interativo para rastreamento de despesas, receitas e orçamentos.

O grande diferencial do projeto é a capacidade de registrar transações diretamente pelo **WhatsApp**, enviando uma simples mensagem para um bot, que é processada por uma Edge Function segura no Supabase e refletida no dashboard do usuário.

---

## ✨ Principais Funcionalidades

* **Autenticação Completa:** Cadastro de usuário com confirmação por e-mail, login (com "Lembrar-me" e "Ver Senha") e recuperação de senha.
* **Modelo Freemium:** Usuários no plano "free" têm um limite de transações. Ao atingir o limite, um modal de upgrade é exibido.
* **Fluxo de Checkout (Simulado):** Uma página de checkout que coleta dados (nome, endereço, cartão fictício) e atualiza o plano do usuário para "pro" no banco de dados.
* **Dashboard Interativo:** Métricas principais (Entradas, Saídas, Saldo Total) e gráficos (como despesas por categoria) usando `Chart.js`.
* **CRUD de Transações:** Funcionalidade completa para Criar, Ler, Atualizar e Deletar transações através de um modal.
* **Filtros:** Página de transações com filtros dinâmicos por descrição e tipo (entrada/saída).
* **Orçamentos (Budgets):** CRUD completo para orçamentos mensais por categoria, com barras de progresso que calculam automaticamente os gastos.
* **Integração com WhatsApp:** Permite ao usuário vincular seu número de WhatsApp e registrar despesas/receitas enviando comandos como `/despesa 50 Padaria Lanche`.
* **Edge Functions (Backend):** Funções serverless seguras no Supabase para:
    * Processar webhooks do WhatsApp para registrar transações.
    * Enviar emails de confirmação de assinatura (usando Resend).
    * Gerar códigos de verificação para vincular contas.
* **Gestão de Perfil:** Página de configurações onde o usuário pode atualizar seu nome completo, alterar a senha e vincular/desvincular contas (WhatsApp).
* **Notificações Profissionais:** Uso de `react-hot-toast` para feedbacks de sucesso e erro, em vez de `alert()`.
* **Design Responsivo:** Interface limpa e moderna construída com Tailwind CSS, totalmente adaptável para desktop e dispositivos móveis.

---

## 🚀 Telas do Projeto

*(Recomendação: Tire screenshots do seu app funcionando e substitua os links abaixo. Você pode arrastar as imagens para a área de "Issues" do seu repositório GitHub para gerar um link para elas.)*

| Dashboard | Transações (Mobile) |
| :---: | :---: |
| <img width="500" height="225" alt="dashboard" src="https://github.com/user-attachments/assets/c1928abe-0e7a-45f0-b163-595d7383389d" /> | <img width="275" height="549" alt="mobile" src="https://github.com/user-attachments/assets/5e04a252-1743-4cb4-9cfb-ba818fe4b5c5" />|


| Orçamentos | Vínculo WhatsApp (Configurações) |
| :---: | :---: |
| <img width="500" height="2225" alt="orçamentos" src="https://github.com/user-attachments/assets/10bfc900-5f44-4f86-aaff-f189d342bfb7" /> | <img width="500" height="225" alt="whatzap5" src="https://github.com/user-attachments/assets/8aa021cd-1773-450f-a06a-bd9f6c9be747" /> |

---

## 🔧 Pilha de Tecnologia (Tech Stack)

O projeto é dividido em um frontend React e um backend serverless no Supabase.

**Frontend:**
* **Framework:** [React 18](https://reactjs.org/) (com [Vite](https://vitejs.dev/))
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Roteamento:** [React Router v6](https://reactrouter.com/)
* **Gráficos:** [Chart.js](https://www.chartjs.org/) com [react-chartjs-2](https://react-chartjs-2.js.org/)
* **Notificações:** [React Hot Toast](https://react-hot-toast.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Gerenciamento de Estado:** [React Context](https://reactjs.org/docs/context.html) (para transações)

**Backend & Infraestrutura:**
* **Plataforma:** [Supabase](https://supabase.com/)
* **Banco de Dados:** [Supabase DB (PostgreSQL)](https://supabase.com/database)
* **Autenticação:** [Supabase Auth](https://supabase.com/auth) (com RLS - Row Level Security)
* **Funções Serverless:** [Supabase Edge Functions](https://supabase.com/functions) (Deno/TypeScript)
* **API de Email (Transacional):** [Resend](https://resend.com/) (para emails de confirmação)
* **API de Mensagens:** [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/cloud-api) (via Webhooks)

---

## ⚙️ Começando (Instalação)

Siga estes passos para rodar o projeto localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (v18+)
* [npm](https://www.npmjs.com/)
* [Supabase CLI](https://supabase.com/docs/guides/cli)
* Uma conta no [Supabase](https://supabase.com)
* (Opcional para Bot) Uma conta [Meta for Developers](https://developers.facebook.com/)
* (Opcional para Bot) Uma conta [Resend](https://resend.com/)

### Configuração do Frontend (React)

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/feliciocavalcante/organize_ja.git](https://github.com/feliciocavalcante/organize_ja.git)
    cd organize_ja
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Vá até o seu painel do Supabase -> "Project Settings" -> "API".
    * Copie a **Project URL** e a **`anon` public key**.
    * Adicione-as ao seu arquivo `.env`:
        ```env
        VITE_SUPABASE_URL=SUA_PROJECT_URL_AQUI
        VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI
        ```

4.  **Rode o projeto localmente:**
    ```bash
    npm run dev
    ```
    O app deve estar rodando em `http://localhost:5173`.

### Configuração do Backend (Supabase)

O frontend não funcionará corretamente sem o setup do banco de dados e das Edge Functions.

1.  **SQL do Banco de Dados:**
    * Vá ao seu painel do Supabase -> "SQL Editor".
    * Execute os scripts SQL necessários para criar suas tabelas. No mínimo:
        * **`profiles`:** (com colunas `id` (FK para `auth.users`), `full_name`, `plan_type` (default 'free'), `phone_number`).
        * **`transacoes`:** (com colunas `id`, `user_id` (FK), `tipo`, `valor`, `descricao`, `categoria`, `data`).
        * **`budgets`:** (com colunas `id`, `user_id` (FK), `category`, `amount`, `month`).
        * **`telegram_links`:** (Opa, este é do Telegram. Se removeu, ignore. Se não, `code`, `telegram_user_id`, `expires_at`).
    * Ative o **Row Level Security (RLS)** para todas as tabelas e adicione as políticas (Policies) para permitir que usuários logados acessem e modifiquem *apenas os seus próprios dados*.

2.  **Configuração da Supabase CLI:**
    * Faça login na CLI (se ainda não fez):
        ```bash
        npx supabase login
        ```
    * Linke seu projeto local ao projeto remoto (substitua `<SEU_PROJECT_REF>`):
        ```bash
        npx supabase link --project-ref <SEU_PROJECT_REF>
        ```

3.  **Configuração dos Segredos (Secrets):**
    Você precisará configurar os segredos para as APIs externas funcionarem nas Edge Functions.
    ```bash
    # Para o email de confirmação de compra (Passo Opcional)
    npx supabase secrets set RESEND_API_KEY=SUA_CHAVE_API_DO_RESEND
    
    # Para o Webhook do WhatsApp (Essencial para o Bot)
    npx supabase secrets set WHATSAPP_VERIFY_TOKEN=SEU_TOKEN_DE_VERIFICACAO_CRIADO_NA_META
    npx supabase secrets set WHATSAPP_ACCESS_TOKEN=SEU_TOKEN_DE_ACESSO_TEMPORARIO_DA_META
    npx supabase secrets set WHATSAPP_PHONE_NUMBER_ID=ID_DO_SEU_NUMERO_DE_TESTE_WHATSAPP
    ```

4.  **Deploy das Edge Functions:**
    * Certifique-se de que as funções (`send-purchase-confirmation`, `whatsapp-webhook`) estão na pasta `supabase/functions/`.
    * Faça o deploy de todas:
        ```bash
        npx supabase functions deploy
        ```

---

## 🤖 Configurando o Bot do WhatsApp

A integração com o WhatsApp é a funcionalidade mais complexa deste projeto e requer configuração externa:

1.  **Configure um App na Meta:** Siga os passos em [Meta for Developers](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started) para criar um App, adicionar o produto "WhatsApp" e obter um número de teste.
2.  **Configure o Webhook:**
    * No painel do seu App Meta, na seção de Webhooks do WhatsApp, insira a URL da sua função: `https_://<SEU_PROJECT_REF>.supabase.co/functions/v1/whatsapp-webhook`.
    * Insira o **Token de Verificação** (o mesmo que você salvou no `WHATSAPP_VERIFY_TOKEN`).
    * Clique em "Verificar e salvar".
    * **Assine** (Subscribe) o campo de webhook `messages`.
3.  **Vincule sua Conta no App:**
    * Vá para a página de **Configurações** no seu app Organize Já.
    * Adicione seu número de WhatsApp pessoal (o mesmo verificado na Meta) no formato `55XX9...`.
4.  **Teste:**
    * Envie uma mensagem do seu WhatsApp pessoal para o número de teste da Meta (ex: `/despesa 50 Padaria Lanche`).
    * Recarregue (F5) a página do Organize Já. A transação deve aparecer.

---

## 📜 Licença

Este projeto é distribuído sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📧 Contato

**Felicio Cavalcante**

* GitHub: [github.com/feliciocavalcante](https://github.com/feliciocavalcante)
* LinkedIn: https://www.linkedin.com/in/felicio-cavalcante-107642152/
