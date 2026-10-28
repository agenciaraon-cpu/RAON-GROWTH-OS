-- ==============================================================================
-- RAON System — Migration Inicial (Etapa 1)
-- Versão: 20250101000000_raon_system_initial_schema.sql
-- Descrição: Tabelas multi-tenant com RLS, perfis, convites, papéis e auditoria
-- Desenvolvedora: RAON — Marketing, IA & Tecnologia
-- ==============================================================================

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela: profiles (vinculado a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_path TEXT,
    phone TEXT,
    is_platform_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela: tenants (Empresas no sistema multi-tenant)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    legal_name TEXT,
    document_number TEXT, -- CPF ou CNPJ
    email TEXT,
    phone TEXT,
    segment TEXT DEFAULT 'Outros', -- Moda, Calçados, Acessórios, Cosméticos, etc.
    logo_path TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'trial')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela: roles (Papéis padronizados de sistema)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabela: permissions (Permissões granulares)
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    module TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Tabela: role_permissions (Vínculo N:N)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 7. Tabela: tenant_members (Associação de usuários a tenants com papel)
CREATE TABLE IF NOT EXISTS public.tenant_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_tenant_user UNIQUE(tenant_id, user_id)
);

-- 8. Tabela: tenant_settings (Preferências da empresa)
CREATE TABLE IF NOT EXISTS public.tenant_settings (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    accent_color TEXT DEFAULT '#345CF3',
    timezone TEXT DEFAULT 'America/Bahia' NOT NULL,
    currency TEXT DEFAULT 'BRL' NOT NULL,
    business_settings JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Tabela: tenant_invitations (Convites de funcionários por e-mail)
CREATE TABLE IF NOT EXISTS public.tenant_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Tabela: plans (Planos SaaS do RAON System)
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'yearly')),
    limits JSONB DEFAULT '{"max_users": 5, "max_products": 500}'::jsonb,
    features JSONB DEFAULT '["pdv", "estoque", "vendas"]'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Tabela: subscriptions (Assinaturas dos lojistas)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'paused')),
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    current_period_end TIMESTAMPTZ,
    external_customer_id TEXT,
    external_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. Tabela: audit_logs (Registros seguros e imutáveis de auditoria)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 13. ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON public.tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON public.tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_email ON public.tenant_invitations(email);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_tenant ON public.tenant_invitations(tenant_id);

-- ==============================================================================
-- 14. FUNÇÕES DE SUPORTE E SEGURANÇA
-- ==============================================================================

-- Verificar se o usuário autenticado é membro ativo de um tenant
CREATE OR REPLACE FUNCTION public.is_tenant_member(_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = _tenant_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
$$;

-- Verificar se o usuário autenticado tem um determinado papel no tenant
CREATE OR REPLACE FUNCTION public.has_role(_tenant_id UUID, _role_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members tm
    JOIN public.roles r ON tm.role_id = r.id
    WHERE tm.tenant_id = _tenant_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
      AND r.code = _role_code
  );
$$;

-- Verificar se o usuário possui permissão específica no tenant
CREATE OR REPLACE FUNCTION public.has_permission(_tenant_id UUID, _permission_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members tm
    JOIN public.role_permissions rp ON tm.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE tm.tenant_id = _tenant_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
      AND p.code = _permission_code
  );
$$;

-- Operação transacional segura: Criação de Tenant com Primeiro Proprietário (Owner)
CREATE OR REPLACE FUNCTION public.create_tenant_with_owner(
    _name TEXT,
    _slug TEXT,
    _segment TEXT,
    _phone TEXT,
    _document_number TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _new_tenant_id UUID;
    _owner_role_id UUID;
    _starter_plan_id UUID;
    _user_id UUID := auth.uid();
BEGIN
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Apenas usuários autenticados podem cadastrar empresas.';
    END IF;

    -- Obter papel de Proprietário
    SELECT id INTO _owner_role_id FROM public.roles WHERE code = 'owner';
    IF _owner_role_id IS NULL THEN
        RAISE EXCEPTION 'Papel de proprietário não encontrado no sistema.';
    END IF;

    -- Inserir Tenant
    INSERT INTO public.tenants (name, slug, segment, phone, document_number, status)
    VALUES (_name, _slug, _segment, _phone, _document_number, 'active')
    RETURNING id INTO _new_tenant_id;

    -- Associar como Proprietário Ativo
    INSERT INTO public.tenant_members (tenant_id, user_id, role_id, status)
    VALUES (_new_tenant_id, _user_id, _owner_role_id, 'active');

    -- Criar Configurações Padrão
    INSERT INTO public.tenant_settings (tenant_id, timezone, currency)
    VALUES (_new_tenant_id, 'America/Bahia', 'BRL');

    -- Obter plano inicial ou criar trial
    SELECT id INTO _starter_plan_id FROM public.plans WHERE slug = 'starter' LIMIT 1;
    IF _starter_plan_id IS NOT NULL THEN
        INSERT INTO public.subscriptions (tenant_id, plan_id, status, trial_ends_at)
        VALUES (_new_tenant_id, _starter_plan_id, 'trial', NOW() + INTERVAL '14 days');
    END IF;

    -- Registrar Auditoria
    INSERT INTO public.audit_logs (tenant_id, actor_user_id, action, entity_type, entity_id, metadata)
    VALUES (_new_tenant_id, _user_id, 'create_tenant', 'tenant', _new_tenant_id::text, jsonb_build_object('name', _name, 'slug', _slug));

    RETURN jsonb_build_object(
        'success', true,
        'tenant_id', _new_tenant_id
    );
END;
$$;

-- Trigger para sincronizar auth.users com profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 15. HABILITAÇÃO DO ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Políticas para TENANTS
CREATE POLICY "Membros ativos podem visualizar seus tenants"
    ON public.tenants FOR SELECT
    USING (public.is_tenant_member(id));

CREATE POLICY "Apenas Proprietários ou Gerentes podem atualizar tenants"
    ON public.tenants FOR UPDATE
    USING (public.has_role(id, 'owner') OR public.has_role(id, 'manager'))
    WITH CHECK (public.has_role(id, 'owner') OR public.has_role(id, 'manager'));

-- Políticas para TENANT_MEMBERS
CREATE POLICY "Membros podem ver outros membros do mesmo tenant"
    ON public.tenant_members FOR SELECT
    USING (public.is_tenant_member(tenant_id));

CREATE POLICY "Apenas Proprietários e Gerentes podem gerenciar membros"
    ON public.tenant_members FOR ALL
    USING (public.has_role(tenant_id, 'owner') OR public.has_role(tenant_id, 'manager'));

-- Políticas para TENANT_SETTINGS
CREATE POLICY "Membros podem ver configurações do tenant"
    ON public.tenant_settings FOR SELECT
    USING (public.is_tenant_member(tenant_id));

CREATE POLICY "Apenas Proprietários ou Gerentes podem editar configurações"
    ON public.tenant_settings FOR UPDATE
    USING (public.has_role(tenant_id, 'owner') OR public.has_role(tenant_id, 'manager'));

-- Políticas para AUDIT_LOGS (Imutável: somente leitura por administradores do tenant)
CREATE POLICY "Proprietários podem ler auditoria do tenant"
    ON public.audit_logs FOR SELECT
    USING (public.has_role(tenant_id, 'owner'));

-- Políticas para ROLES e PERMISSIONS (Somente leitura para usuários autenticados)
CREATE POLICY "Roles visíveis para autenticados" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permissions visíveis para autenticados" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "RolePermissions visíveis para autenticados" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Planos visíveis para todos" ON public.plans FOR SELECT USING (active = true);

-- ==============================================================================
-- 16. DADOS INICIAIS (SEEDS DE PAPÉIS E PERMISSÕES)
-- ==============================================================================
INSERT INTO public.roles (code, name, description) VALUES
    ('owner', 'Proprietário', 'Acesso irrestrito a todas as funções, financeiro e equipe da empresa.'),
    ('manager', 'Gerente', 'Gestão operacional, supervisão de vendas, estoque e equipe.'),
    ('cashier', 'Operador de Caixa', 'Acesso ao PDV, abertura/fechamento de caixa e registro de recebimentos.'),
    ('sales', 'Vendedor', 'Acesso a vendas, catálogo de produtos, orçamentos e clientes.'),
    ('stock', 'Estoquista', 'Gestão de entradas, saídas, conferência e inventário físico.'),
    ('financial', 'Financeiro', 'Contas a pagar, contas a receber, fluxo de caixa e relatórios fiscais.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.plans (slug, name, price, billing_interval, limits, features, active) VALUES
    ('plano_fixo_lucre', 'Plano Fixo Lucre+', 29.90, 'monthly', '{"max_users": 999, "max_products": 99999}', '["pdv", "estoque", "vendas", "crediario", "financeiro", "catalogo", "equipe", "todas_as_features"]', true)
ON CONFLICT (slug) DO UPDATE SET price = 29.90, name = 'Plano Fixo Lucre+';

