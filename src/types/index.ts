export type UserRole = 'super_admin' | 'client_admin' | 'sales_user';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  currentOrganizationId: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export type OrgPlan = 'Starter' | 'Growth' | 'Scale' | 'Enterprise';
export type OrgStatus = 'active' | 'trialing' | 'past_due' | 'canceled';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  cnpj?: string;
  segment: string;
  plan: OrgPlan;
  status: OrgStatus;
  ownerUid?: string;
  mrr: number;
  healthScore: number;
  churnRisk: number;
  createdAt: string;
  updatedAt?: string;
}

export type ClientStatus = 'active' | 'inactive' | 'onboarding' | 'churned';

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  cnpj?: string;
  segment: 'Imobiliária' | 'Clínica' | 'Advocacia' | 'Varejo' | 'Serviços' | 'Educação' | 'Restaurante' | 'Outros';
  city: string;
  state: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  email: string;
  plan: string;
  status: ClientStatus;
  startDate: string;
  raonResponsible: string;
  monthlyTarget: number;
  averageTicket: number;
  healthScore: number; // 0-100
  churnRisk: number; // percentage 0-100
  createdAt: string;
  updatedAt?: string;
}

export type LeadStage = 
  | 'novo_lead'
  | 'contato'
  | 'qualificado'
  | 'orcamento'
  | 'negociacao'
  | 'ganho'
  | 'perdido';

export interface Lead {
  id: string;
  organizationId: string;
  clientId?: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  company?: string;
  city?: string;
  state?: string;
  origin: 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'Orgânico' | 'WhatsApp' | 'Indicação' | 'Landing Page' | 'Outros';
  campaignId?: string;
  campaignName?: string;
  service?: string;
  responsible: string;
  stage: LeadStage;
  potentialValue: number;
  notes?: string;
  nextAction?: string;
  lastInteractionAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DealStatus = 'open' | 'won' | 'lost';

export interface Deal {
  id: string;
  organizationId: string;
  leadId: string;
  leadName: string;
  clientId?: string;
  title: string;
  value: number;
  stage: LeadStage;
  responsible: string;
  status: DealStatus;
  wonAt?: string;
  lostAt?: string;
  lostReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  responsible: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  clientId?: string;
  leadId?: string;
  dealId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ActivityType = 
  | 'lead_created'
  | 'contact'
  | 'call'
  | 'whatsapp'
  | 'note'
  | 'proposal'
  | 'follow_up'
  | 'won'
  | 'lost'
  | 'stage_change';

export interface Activity {
  id: string;
  organizationId: string;
  leadId?: string;
  dealId?: string;
  type: ActivityType;
  description: string;
  userName: string;
  userUid?: string;
  createdAt: string;
}

export type CampaignChannel = 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'Orgânico' | 'WhatsApp' | 'Indicação' | 'Outros';

export interface Campaign {
  id: string;
  organizationId: string;
  clientId?: string;
  name: string;
  channel: CampaignChannel;
  objective: string;
  budget: number;
  spent: number;
  leads: number;
  sales: number;
  revenue: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  landingPage?: string;
  utmSource?: string;
  createdAt: string;
}

export interface AutomationStep {
  id: string;
  type: 'action' | 'wait' | 'condition';
  title: string;
  details: string;
}

export interface Automation {
  id: string;
  organizationId: string;
  name: string;
  trigger: 'lead.created' | 'lead.updated' | 'deal.won' | 'deal.lost' | 'task.overdue' | 'form.submitted';
  active: boolean;
  executionCount: number;
  stepsCount: number;
  description: string;
  steps?: AutomationStep[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'create' | 'edit' | 'delete' | 'stage_change' | 'export' | 'integration';
  entity: string;
  entityId?: string;
  details: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  createdAt: string;
  actionLabel?: string;
}

export interface Integration {
  id: string;
  organizationId: string;
  provider: 'whatsapp' | 'meta_ads' | 'google_ads' | 'google_analytics' | 'stripe' | 'mercado_pago' | 'asaas' | 'webhooks';
  name: string;
  category: 'Comunicação' | 'Tráfego' | 'Analytics' | 'Financeiro' | 'Automação';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  config: Record<string, string>;
  description: string;
}

export type AgencyPlan = 'Bronze' | 'Prata' | 'Ouro';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface AgencyClient {
  id: string;
  clientName: string; // Nome do responsável/cliente
  companyName: string; // Empresa
  document: string; // CNPJ ou CPF
  phone: string; // Número de telefone / WhatsApp
  email?: string;
  contractStartDate: string; // Data de contratação / início
  dueDay: number; // Dia de vencimento do pagamento (ex: 5, 10, 15, 20)
  monthlyValue: number; // Valor mensal do contrato
  plan: AgencyPlan; // Bronze, Prata, Ouro
  paymentStatus: PaymentStatus; // Pago, Pendente, Atrasado
  lastPaymentDate?: string;
  services: string[]; // ['Gestão de Instagram', 'Tráfego Pago', 'Criativos para Redes Sociais', 'Marketing Geral']
  instagram?: string;
  notes?: string;
  responsibleStaffName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string; // Função / Cargo
  phone: string;
  email: string;
  status: 'active' | 'vacation' | 'inactive';
  assignedClientNames?: string[];
  startDate: string;
  salary?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AgencyWhatsAppConfig {
  provider: 'direct_web' | 'zapi' | 'evolution' | 'meta_cloud';
  businessPhone: string;
  instanceId?: string;
  apiKey?: string;
  webhookUrl?: string;
  isConnected: boolean;
  pixKey?: string;
  mode?: 'direct_web' | 'api_gateway';
}

export interface ClientAutomationRule {
  id: string;
  type: 'overdue_3days' | 'monday_greeting' | 'saturday_weekend';
  title: string;
  enabled: boolean;
  scheduleTime: string; // ex: '08:30'
  messageTemplate: string;
  daysDelay?: number; // ex: 3
  lastTriggeredAt?: string;
  sentCount: number;
}

export interface WhatsAppMessageLog {
  id: string;
  clientName: string;
  companyName: string;
  phone: string;
  type: 'overdue_3days' | 'monday_greeting' | 'saturday_weekend' | 'manual';
  message: string;
  status: 'sent' | 'scheduled' | 'failed';
  sentAt: string;
}

