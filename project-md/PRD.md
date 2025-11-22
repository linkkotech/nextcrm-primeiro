# Product Requirements Document (PRD) - NextCRM

## 1. Visão Geral

### O Conceito
**"A Shopify do Clienteling"**. O NextCRM é uma plataforma móvel que transforma o vendedor do varejo físico em um hub de captura de leads. Ele funde três ferramentas em uma:
1.  **Perfil Digital Inteligente** (Substitui o cartão de visitas e atua como Micro-Landing Page).
2.  **CRM Simples** (Captura o lead na hora).
3.  **Agente de IA** (O "funcionário virtual" no WhatsApp).

### O Problema
A "evaporação de leads" no ponto de venda. O contato feito na loja é perdido em papéis ou conversas informais de WhatsApp. CRMs tradicionais são complexos demais para a velocidade do atendimento presencial.

### A Solução
Uma ferramenta que permite ao vendedor registrar o interesse do cliente e iniciar um relacionamento digital no exato momento da conversa, trazendo a inteligência do e-commerce para o balcão da loja.

### Visão de Longo Prazo (1 Ano)
Ser a ferramenta essencial para qualquer vendedor do varejo físico.
*   **Diferencial Estratégico (Futuro):** Criar um "Sistema Comparador de Preços Local" usando os dados geoespaciais e de portfólio coletados.

---

## 2. Métricas de Sucesso (KPIs)

### OMTM (One Metric That Matters)
*   **Leads Capturados via Perfil Digital (Semanalmente).**
    *   *Justificativa:* Prova a adoção da funcionalidade core no ponto de venda.

### Metas de Negócio (3 Meses)
*   **Conversão Trial -> Pago:** 15%.
*   **Churn Mensal:** 5% - 7%.
*   **Engajamento:** Vendedor ativo = Cria pelo menos 1 contato via perfil/semana.

### Metas Técnicas (Performance)
*   **Carregamento do Perfil Digital:** < 1.5 segundos (Crítico).
*   **Salvar Novo Contato:** < 2 segundos.
*   **Carregamento do Dashboard:** < 3 segundos.
*   **Escalabilidade:** Suportar 1.000 usuários/workspace e 100.000 contatos sem degradação.

---

## 3. Personas

### O Usuário Final (work_user)
*   **Quem:** Vendedor de loja, corretor, atendente.
*   **Perfil:** Mobile-first. Orientado à ação. Não usa desktop.
*   **UX Necessária:** "Instagram-level". Simplicidade radical. Botões grandes. Uso com uma mão.

### O Cliente (work_admin)
*   **Quem:** Dono de pequeno/médio negócio (SMB).
*   **Perfil:** Focado em resultados. Pouco tempo. Usa desktop para gestão.
*   **UX Necessária:** "Linear-vibe". Eficiente, densa em informações úteis, mas clara.

### O Admin da Plataforma (super_admin)
*   **Quem:** Equipe interna NextCRM.
*   **Responsabilidade:** Gestão de planos, infraestrutura e templates mestres.

---

## 4. Escopo do MVP

### ✅ IN (Obrigatório para Lançamento)

#### 1. Módulo de Perfis Digitais (CMS Core)
*   **Conceito:** O CRM atua como um CMS para criar "Micro Landing Pages" para vendedores.
*   **DigitalTemplate:** O "molde" visual (definido pelo admin/dono).
*   **DigitalProfile:** A página pública do vendedor.
    *   **Input:** Vendedor usa para cadastrar o cliente rapidamente.
    *   **Apresentação:** Cliente vê os dados, portfólio e links do vendedor.

#### 2. Módulo Smart CRM (Contatos)
*   **Gestão de Contatos:** Criar, Editar, Listar, Excluir.
*   **Contexto:** Armazenar "Quem", "Onde" (Unidade) e "Interesse" (Produto).
*   **Histórico:** Visualização simples das interações.

#### 3. Módulo de Equipe & Roles
*   **Modelo de Permissão:** Papéis Fixos (Admin, Manager, User). Sem granularidade complexa no MVP.
*   **Convites:** Fluxo via Magic Link (Supabase).

#### 4. Agente de IA (WhatsApp)
*   **Função:** Chatbot de atendimento treinado com RAG (Retrieval-Augmented Generation) no portfólio da loja.
*   **Capacidades:** Responder dúvidas de produtos, verificar disponibilidade, enviar link de checkout.

#### 5. Infraestrutura & Billing
*   **Multi-tenant:** Organização -> Workspace -> Unidade.
*   **Billing:** Integração Stripe (Assinaturas, Trials).
*   **i18n:** Suporte a PT-BR e ES (LatAm) no App.
*   **Geoespacial:** Coleta de Latitude/Longitude nos Endereços (preparação para o futuro Comparador de Preços).

### ❌ OUT (Para Futuras Versões)
*   Kanban de Vendas / Pipelines complexos.
*   Tarefas, Calendário, Projetos.
*   Automação (Regras Se/Então).
*   Relatórios Avançados.
*   Importação de Dados (CSV).
*   App Nativo (React Native) - Foco total em Web Responsivo.
*   Google Calendar Integration.
*   Email Marketing.

---

## 5. Fluxos de Usuário Chave

### 1. Onboarding (Novo Cliente)
1.  **Cadastro:** Criação de conta + Workspace + Trial (Stripe).
2.  **Wizard:**
    *   Passo 1: Branding (Logo/Cor).
    *   Passo 2: Primeira Unidade (Coleta de Endereço/Geo).
    *   Passo 3: Convidar primeiro vendedor.
3.  **Dashboard:** Checklist de "Próximos Passos".

### 2. Captura de Lead (Vendedor - Mobile)
1.  Vendedor abre seu próprio Perfil Digital no celular.
2.  Clica em "Novo Cliente".
3.  Preenche Nome e WhatsApp (e opcionalmente interesse).
4.  Sistema salva o contato no CRM.
5.  Sistema envia o cartão do vendedor para o WhatsApp do cliente (via IA).

---

## 6. Diretrizes de Design & UX

*   **Inspiração Visual:**
    *   **Desktop (Admin):** [Linear](https://linear.app) - Densidade, eficiência.
    *   **Mobile (Vendedor):** [Beacons](https://beacons.ai) - Botões grandes, foco único.
*   **Tema:** Dark Mode obrigatório.
*   **Identidade:** Shadcn/ui (Slate/Zinc) default.

---

## 7. Stack Tecnológica Confirmada
*   **Frontend:** Next.js 15.1 (App Router).
*   **Styling:** TailwindCSS v3.4 + Shadcn/UI.
*   **Backend/DB:** Server Actions + Prisma ORM + PostgreSQL.
*   **Auth:** Supabase Auth (Magic Links).
*   **Storage:** Supabase Storage (Upload de imagens de perfil/logo).
*   **Realtime:** Supabase Realtime (Futuro: Chat/Notificações).
*   **Payments:** Stripe.
*   **i18n:** next-intl.
