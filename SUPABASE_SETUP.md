# Guia de Configuração do Supabase — RAON System (Etapa 1)

Este guia contém o passo a passo para conectar o **RAON System** ao seu projeto Supabase com PostgreSQL, Auth e Storage.

---

## 1. Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta ou faça login.
2. Clique em **"New Project"**.
3. Defina um nome para o projeto (ex: `raon-system-prod`).
4. Escolha uma senha forte para o banco de dados.
5. Selecione a região **"São Paulo (sa-east-1)"** ou a mais próxima.
6. Clique em **"Create new project"** e aguarde 1 a 2 minutos até a conclusão.

---

## 2. Aplicar as Migrations do Banco de Dados
1. No menu lateral do Supabase, clique em **"SQL Editor"**.
2. Clique em **"New Query"**.
3. Abra o arquivo `supabase/migrations/20250101000000_raon_system_initial_schema.sql` deste projeto, copie todo o seu conteúdo e cole no editor do Supabase.
4. Clique em **"Run"** (ou Ctrl+Enter).
5. O banco criará automaticamente:
   - Tabelas: `profiles`, `tenants`, `tenant_members`, `roles`, `permissions`, `tenant_settings`, `tenant_invitations`, `plans`, `subscriptions`, `audit_logs`.
   - Triggers e Funções seguras (RLS habilitado).
   - Papéis pré-configurados: **Proprietário**, **Gerente**, **Operador de Caixa**, **Vendedor**, **Estoquista**, **Financeiro**.

---

## 3. Configurar os Buckets de Armazenamento (Storage)
1. No **SQL Editor**, abra outra aba.
2. Copie e cole o conteúdo de `supabase/storage.sql`.
3. Clique em **"Run"**.
4. Isso criará os buckets públicos `avatars` e `logos` com políticas seguras por usuário.

---

## 4. Obter as Chaves de API
1. No menu lateral esquerdo do Supabase, clique em **"Project Settings"** (ícone de engrenagem).
2. Clique na aba **"API"**.
3. Copie:
   - **Project URL** (ex: `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key

---

## 5. Configurar as Variáveis de Ambiente no RAON System
Crie ou edite o arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica-aqui"
```

> **Aviso de Segurança**: Nunca exponha a chave `service_role` no código frontend. Ela possui privilégios de superadministrador e deve ser usada exclusivamente em rotas protegidas no servidor.

---

## 6. Modo Sandbox / Demonstração no App
Se você ainda não tiver configurado as chaves do Supabase, o RAON System inclui um **Assistente de Conexão com Supabase** e um **Modo Sandbox 100% Funcional** integrado na própria interface. Você pode testar:
- Cadastro e login
- Criação e seleção de empresas
- Edição de perfil com upload de fotos
- Gestão de equipe e convites com papéis (Proprietário, Gerente, etc.)
- Configurações da empresa
- Painel RAON Admin para superusuários
- Isolamento multi-tenant real
