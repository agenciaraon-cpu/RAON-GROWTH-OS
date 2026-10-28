// ==============================================================================
// RAON System — Definições de Tipos TypeScript (Etapa 1)
// ==============================================================================

export type RoleCode = 'owner' | 'manager' | 'cashier' | 'sales' | 'stock' | 'financial';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarPath?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  isPlatformAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'trial';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  legalName?: string;
  documentNumber?: string; // CPF ou CNPJ
  email?: string;
  phone?: string;
  segment: string;
  logoPath?: string | null;
  logoUrl?: string | null;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  code: RoleCode;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  code: string;
  description: string;
  module: string;
}

export type MemberStatus = 'active' | 'invited' | 'inactive';

export interface TenantMember {
  id: string;
  tenantId: string;
  userId: string;
  roleId: string;
  roleCode: RoleCode;
  roleName: string;
  status: MemberStatus;
  userName: string;
  userEmail: string;
  userPhone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TenantSettings {
  tenantId: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  timezone: string;
  currency: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  businessSettings?: Record<string, any>;
  updatedAt: string;
}

export interface TenantInvitation {
  id: string;
  tenantId: string;
  email: string;
  roleId: string;
  roleCode: RoleCode;
  roleName: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface Plan {
  id: string;
  slug: string;
  name: string;
  price: number;
  billingInterval: 'monthly' | 'yearly';
  limits: {
    maxUsers: number;
    maxProducts: number;
  };
  features: string[];
  active: boolean;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  planName?: string;
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  externalCustomerId?: string;
  externalSubscriptionId?: string;
}

export interface AuditLog {
  id: string;
  tenantId?: string;
  actorUserId?: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type AppNavigationRoute = 
  | 'overview'
  | 'pos'
  | 'sales'
  | 'products'
  | 'stock'
  | 'clients'
  | 'credit'
  | 'receivables'
  | 'finance'
  | 'expenses'
  | 'inventory'
  | 'online_catalog'
  | 'quotes'
  | 'deliveries'
  | 'team'
  | 'reports'
  | 'settings'
  | 'profile'
  | 'raon_admin'
  | 'support';
