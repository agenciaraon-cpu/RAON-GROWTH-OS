import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Client, Lead, Deal, Task, Activity, Campaign, Automation, 
  AuditLog, AIInsight, Integration, LeadStage, DealStatus,
  AgencyClient, TeamMember, PaymentStatus
} from '../types';
import { 
  DEMO_CLIENTS, generateDemoLeads, generateDemoDeals, 
  DEMO_CAMPAIGNS, DEMO_TASKS, DEMO_AUTOMATIONS, 
  DEMO_AUDIT_LOGS, DEMO_AI_INSIGHTS, DEMO_INTEGRATIONS,
  DEMO_AGENCY_CLIENTS, DEMO_TEAM_MEMBERS
} from '../data/demoData';
import { useAuth } from './AuthContext';

interface DataContextType {
  clients: Client[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  campaigns: Campaign[];
  automations: Automation[];
  auditLogs: AuditLog[];
  aiInsights: AIInsight[];
  integrations: Integration[];

  // Agency Clients (Gestão de Contratos de Marketing da RAON)
  agencyClients: AgencyClient[];
  addAgencyClient: (client: Omit<AgencyClient, 'id' | 'createdAt'>) => AgencyClient;
  updateAgencyClient: (id: string, updates: Partial<AgencyClient>) => void;
  deleteAgencyClient: (id: string) => void;
  updateAgencyPaymentStatus: (id: string, status: PaymentStatus) => void;

  // Team Members (Equipe da Agência RAON)
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => TeamMember;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  
  // CRUD actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  changeLeadStage: (id: string, stage: LeadStage) => void;
  
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  moveDealStage: (id: string, stage: LeadStage) => void;
  setDealStatus: (id: string, status: DealStatus, reason?: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Activity;
  
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  
  toggleAutomation: (id: string) => void;
  addAutomation: (automation: Omit<Automation, 'id' | 'createdAt'>) => Automation;
  
  toggleIntegration: (id: string) => void;
  updateIntegrationConfig: (id: string, config: Record<string, string>) => void;
  
  resetToDemo: () => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrg, currentUser, isDemoMode } = useAuth();

  // Initial data bootstrap
  const [allClients, setAllClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('raon_data_clients');
    return saved ? JSON.parse(saved) : DEMO_CLIENTS;
  });

  const [allLeads, setAllLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('raon_data_leads');
    if (saved) return JSON.parse(saved);
    return generateDemoLeads();
  });

  const [allDeals, setAllDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('raon_data_deals');
    if (saved) return JSON.parse(saved);
    return generateDemoDeals(allLeads);
  });

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('raon_data_tasks');
    return saved ? JSON.parse(saved) : DEMO_TASKS;
  });

  const [allActivities, setAllActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('raon_data_activities');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'act-1',
        organizationId: 'org-raon',
        leadId: 'lead-1',
        type: 'contact',
        description: 'Primeiro contato realizado via WhatsApp. Cliente demonstrou alto interesse.',
        userName: 'Roberto Lima (SDR)',
        createdAt: 'Hoje às 10:30',
      },
      {
        id: 'act-2',
        organizationId: 'org-raon',
        leadId: 'lead-1',
        type: 'proposal',
        description: 'Proposta comercial preliminar enviada por e-mail no valor de R$ 75.000,00.',
        userName: 'Paula Mendes (Closer)',
        createdAt: 'Ontem às 16:15',
      },
    ];
  });

  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('raon_data_campaigns');
    return saved ? JSON.parse(saved) : DEMO_CAMPAIGNS;
  });

  const [allAutomations, setAllAutomations] = useState<Automation[]>(() => {
    const saved = localStorage.getItem('raon_data_automations');
    return saved ? JSON.parse(saved) : DEMO_AUTOMATIONS;
  });

  const [allAuditLogs, setAllAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('raon_data_audit');
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
  });

  const [allAIInsights] = useState<AIInsight[]>(DEMO_AI_INSIGHTS);

  const [allIntegrations, setAllIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem('raon_data_integrations');
    return saved ? JSON.parse(saved) : DEMO_INTEGRATIONS;
  });

  const [allAgencyClients, setAllAgencyClients] = useState<AgencyClient[]>(() => {
    const saved = localStorage.getItem('raon_data_agency_clients');
    return saved ? JSON.parse(saved) : DEMO_AGENCY_CLIENTS;
  });

  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('raon_data_team_members');
    return saved ? JSON.parse(saved) : DEMO_TEAM_MEMBERS;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('raon_data_clients', JSON.stringify(allClients));
    localStorage.setItem('raon_data_leads', JSON.stringify(allLeads));
    localStorage.setItem('raon_data_deals', JSON.stringify(allDeals));
    localStorage.setItem('raon_data_tasks', JSON.stringify(allTasks));
    localStorage.setItem('raon_data_activities', JSON.stringify(allActivities));
    localStorage.setItem('raon_data_campaigns', JSON.stringify(allCampaigns));
    localStorage.setItem('raon_data_automations', JSON.stringify(allAutomations));
    localStorage.setItem('raon_data_audit', JSON.stringify(allAuditLogs));
    localStorage.setItem('raon_data_integrations', JSON.stringify(allIntegrations));
    localStorage.setItem('raon_data_agency_clients', JSON.stringify(allAgencyClients));
    localStorage.setItem('raon_data_team_members', JSON.stringify(allTeamMembers));
  }, [allClients, allLeads, allDeals, allTasks, allActivities, allCampaigns, allAutomations, allAuditLogs, allIntegrations, allAgencyClients, allTeamMembers]);

  // STRICT MULTI-TENANT FILTERING:
  // If user is super_admin on org-raon, they see all or RAON data.
  // If user is in specific tenant (e.g. org-alpha), they ONLY see data matching that organization or their client!
  const isSuperAdminHQ = currentUser.role === 'super_admin' && currentOrg.id === 'org-raon';

  const clients = useMemo(() => {
    if (isSuperAdminHQ) return allClients;
    return allClients.filter(c => c.organizationId === currentOrg.id || c.name.toLowerCase().includes(currentOrg.slug));
  }, [allClients, isSuperAdminHQ, currentOrg]);

  const leads = useMemo(() => {
    if (isSuperAdminHQ) return allLeads;
    return allLeads.filter(l => l.organizationId === currentOrg.id || (currentOrg.id === 'org-alpha' && l.clientId === 'client-1'));
  }, [allLeads, isSuperAdminHQ, currentOrg]);

  const deals = useMemo(() => {
    if (isSuperAdminHQ) return allDeals;
    return allDeals.filter(d => d.organizationId === currentOrg.id || (currentOrg.id === 'org-alpha' && d.clientId === 'client-1'));
  }, [allDeals, isSuperAdminHQ, currentOrg]);

  const tasks = useMemo(() => {
    if (isSuperAdminHQ) return allTasks;
    return allTasks.filter(t => t.organizationId === currentOrg.id || (currentOrg.id === 'org-alpha' && t.clientId === 'client-1'));
  }, [allTasks, isSuperAdminHQ, currentOrg]);

  const activities = useMemo(() => {
    if (isSuperAdminHQ) return allActivities;
    return allActivities.filter(a => a.organizationId === currentOrg.id);
  }, [allActivities, isSuperAdminHQ, currentOrg]);

  const campaigns = useMemo(() => {
    if (isSuperAdminHQ) return allCampaigns;
    return allCampaigns.filter(c => c.organizationId === currentOrg.id || (currentOrg.id === 'org-alpha' && c.clientId === 'client-1'));
  }, [allCampaigns, isSuperAdminHQ, currentOrg]);

  const automations = useMemo(() => {
    if (isSuperAdminHQ) return allAutomations;
    return allAutomations.filter(a => a.organizationId === currentOrg.id);
  }, [allAutomations, isSuperAdminHQ, currentOrg]);

  const auditLogs = useMemo(() => {
    if (isSuperAdminHQ) return allAuditLogs;
    return allAuditLogs.filter(a => a.organizationId === currentOrg.id);
  }, [allAuditLogs, isSuperAdminHQ, currentOrg]);

  const integrations = useMemo(() => {
    if (isSuperAdminHQ) return allIntegrations;
    return allIntegrations.filter(i => i.organizationId === currentOrg.id);
  }, [allIntegrations, isSuperAdminHQ, currentOrg]);

  // Helper to log audit
  const logAudit = (action: AuditLog['action'], entity: string, details: string, entityId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      organizationId: currentOrg.id,
      userId: currentUser.uid,
      userName: currentUser.name,
      action,
      entity,
      entityId,
      details,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setAllAuditLogs(prev => [newLog, ...prev]);
  };

  // CLIENTS CRUD
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...data,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllClients(prev => [newClient, ...prev]);
    logAudit('create', 'Cliente', `Cliente "${newClient.name}" cadastrado com sucesso.`, newClient.id);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setAllClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    logAudit('edit', 'Cliente', `Dados do cliente atualizados.`, id);
  };

  const deleteClient = (id: string) => {
    const found = allClients.find(c => c.id === id);
    setAllClients(prev => prev.filter(c => c.id !== id));
    logAudit('delete', 'Cliente', `Cliente "${found?.name || id}" excluído do sistema.`, id);
  };

  // LEADS CRUD
  const addLead = (data: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllLeads(prev => [newLead, ...prev]);
    
    // Automatically log activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      organizationId: currentOrg.id,
      leadId: newLead.id,
      type: 'lead_created',
      description: `Lead cadastrado via ${newLead.origin}.`,
      userName: currentUser.name,
      createdAt: 'Agora',
    };
    setAllActivities(prev => [newActivity, ...prev]);
    logAudit('create', 'Lead', `Lead "${newLead.name}" criado no estágio "${newLead.stage}".`, newLead.id);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setAllLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
    logAudit('edit', 'Lead', `Informações do lead atualizadas.`, id);
  };

  const deleteLead = (id: string) => {
    setAllLeads(prev => prev.filter(l => l.id !== id));
    logAudit('delete', 'Lead', `Lead excluído.`, id);
  };

  const changeLeadStage = (id: string, stage: LeadStage) => {
    setAllLeads(prev => prev.map(l => {
      if (l.id === id) {
        const oldStage = l.stage;
        logAudit('stage_change', 'Lead', `Lead "${l.name}" movido de "${oldStage}" para "${stage}".`, id);
        
        // Add activity
        const newAct: Activity = {
          id: `act-${Date.now()}`,
          organizationId: currentOrg.id,
          leadId: id,
          type: 'stage_change',
          description: `Estágio alterado para "${stage.toUpperCase()}".`,
          userName: currentUser.name,
          createdAt: 'Agora',
        };
        setAllActivities(a => [newAct, ...a]);

        return { ...l, stage, updatedAt: new Date().toISOString() };
      }
      return l;
    }));
  };

  // DEALS CRUD
  const addDeal = (data: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...data,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllDeals(prev => [newDeal, ...prev]);
    logAudit('create', 'Deal', `Oportunidade "${newDeal.title}" aberta no valor de R$ ${newDeal.value.toLocaleString('pt-BR')}.`, newDeal.id);
    return newDeal;
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setAllDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    logAudit('edit', 'Deal', `Oportunidade atualizada.`, id);
  };

  const moveDealStage = (id: string, stage: LeadStage) => {
    setAllDeals(prev => prev.map(d => {
      if (d.id === id) {
        logAudit('stage_change', 'Deal', `Oportunidade "${d.title}" movida para estágio "${stage}".`, id);
        return { 
          ...d, 
          stage, 
          status: stage === 'ganho' ? 'won' : (stage === 'perdido' ? 'lost' : 'open'),
          wonAt: stage === 'ganho' ? new Date().toISOString() : undefined,
          lostAt: stage === 'perdido' ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString() 
        };
      }
      return d;
    }));
  };

  const setDealStatus = (id: string, status: DealStatus, reason?: string) => {
    setAllDeals(prev => prev.map(d => {
      if (d.id === id) {
        logAudit('stage_change', 'Deal', `Oportunidade marcada como ${status.toUpperCase()}.`, id);
        return { 
          ...d, 
          status, 
          stage: status === 'won' ? 'ganho' : (status === 'lost' ? 'perdido' : d.stage),
          lostReason: reason,
          wonAt: status === 'won' ? new Date().toISOString() : undefined,
          lostAt: status === 'lost' ? new Date().toISOString() : undefined,
        };
      }
      return d;
    }));
  };

  // TASKS CRUD
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllTasks(prev => [newTask, ...prev]);
    logAudit('create', 'Tarefa', `Tarefa "${newTask.title}" atribuída a ${newTask.responsible}.`, newTask.id);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    logAudit('edit', 'Tarefa', `Tarefa atualizada.`, id);
  };

  const completeTask = (id: string) => {
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', updatedAt: new Date().toISOString() } : t));
    logAudit('edit', 'Tarefa', `Tarefa concluída com sucesso.`, id);
  };

  const deleteTask = (id: string) => {
    setAllTasks(prev => prev.filter(t => t.id !== id));
    logAudit('delete', 'Tarefa', `Tarefa removida.`, id);
  };

  // ACTIVITY
  const addActivity = (data: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...data,
      id: `act-${Date.now()}`,
      createdAt: 'Agora',
    };
    setAllActivities(prev => [newActivity, ...prev]);
    return newActivity;
  };

  // CAMPAIGNS
  const addCampaign = (data: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCamp: Campaign = {
      ...data,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllCampaigns(prev => [newCamp, ...prev]);
    logAudit('create', 'Campanha', `Campanha "${newCamp.name}" criada no canal ${newCamp.channel}.`, newCamp.id);
    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setAllCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAudit('edit', 'Campanha', `Campanha atualizada.`, id);
  };

  // AUTOMATIONS
  const toggleAutomation = (id: string) => {
    setAllAutomations(prev => prev.map(a => {
      if (a.id === id) {
        const nextActive = !a.active;
        logAudit('edit', 'Automação', `Automação "${a.name}" ${nextActive ? 'ativada' : 'pausada'}.`, id);
        return { ...a, active: nextActive };
      }
      return a;
    }));
  };

  const addAutomation = (data: Omit<Automation, 'id' | 'createdAt'>) => {
    const newAuto: Automation = {
      ...data,
      id: `auto-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllAutomations(prev => [newAuto, ...prev]);
    logAudit('create', 'Automação', `Nova automação "${newAuto.name}" configurada com gatilho ${newAuto.trigger}.`, newAuto.id);
    return newAuto;
  };

  // INTEGRATIONS
  const toggleIntegration = (id: string) => {
    setAllIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'connected' ? 'disconnected' : 'connected';
        logAudit('integration', 'Integração', `Status da integração "${item.name}" alterado para ${nextStatus}.`, id);
        return { 
          ...item, 
          status: nextStatus,
          lastSyncAt: nextStatus === 'connected' ? 'Agora' : undefined
        };
      }
      return item;
    }));
  };

  const updateIntegrationConfig = (id: string, config: Record<string, string>) => {
    setAllIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        logAudit('integration', 'Integração', `Credenciais da integração "${item.name}" atualizadas.`, id);
        return { ...item, config, status: 'connected', lastSyncAt: 'Agora' };
      }
      return item;
    }));
  };

  // Agency Clients CRUD
  const addAgencyClient = (data: Omit<AgencyClient, 'id' | 'createdAt'>) => {
    const newClient: AgencyClient = {
      ...data,
      id: `ac-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllAgencyClients(prev => [newClient, ...prev]);
    logAudit('create', 'Cliente RAON', `Cliente de Marketing "${newClient.companyName}" cadastrado no plano ${newClient.plan}.`, newClient.id);
    return newClient;
  };

  const updateAgencyClient = (id: string, updates: Partial<AgencyClient>) => {
    setAllAgencyClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    logAudit('edit', 'Cliente RAON', `Dados do cliente de marketing atualizados.`, id);
  };

  const deleteAgencyClient = (id: string) => {
    const found = allAgencyClients.find(c => c.id === id);
    setAllAgencyClients(prev => prev.filter(c => c.id !== id));
    logAudit('delete', 'Cliente RAON', `Cliente "${found?.companyName || id}" removido da agência.`, id);
  };

  const updateAgencyPaymentStatus = (id: string, status: PaymentStatus) => {
    setAllAgencyClients(prev => prev.map(c => {
      if (c.id === id) {
        logAudit('edit', 'Pagamento', `Status de pagamento do cliente "${c.companyName}" alterado para ${status}.`, id);
        return { 
          ...c, 
          paymentStatus: status, 
          lastPaymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : c.lastPaymentDate,
          updatedAt: new Date().toISOString() 
        };
      }
      return c;
    }));
  };

  // Team Member CRUD
  const addTeamMember = (data: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...data,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAllTeamMembers(prev => [newMember, ...prev]);
    logAudit('create', 'Equipe RAON', `Membro da equipe "${newMember.name}" adicionado na função ${newMember.role}.`, newMember.id);
    return newMember;
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setAllTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
    logAudit('edit', 'Equipe RAON', `Cadastro do membro da equipe atualizado.`, id);
  };

  const deleteTeamMember = (id: string) => {
    const found = allTeamMembers.find(m => m.id === id);
    setAllTeamMembers(prev => prev.filter(m => m.id !== id));
    logAudit('delete', 'Equipe RAON', `Membro "${found?.name || id}" removido da equipe.`, id);
  };

  const resetToDemo = () => {
    const leads = generateDemoLeads();
    setAllClients(DEMO_CLIENTS);
    setAllLeads(leads);
    setAllDeals(generateDemoDeals(leads));
    setAllTasks(DEMO_TASKS);
    setAllCampaigns(DEMO_CAMPAIGNS);
    setAllAutomations(DEMO_AUTOMATIONS);
    setAllAuditLogs(DEMO_AUDIT_LOGS);
    setAllIntegrations(DEMO_INTEGRATIONS);
    setAllAgencyClients(DEMO_AGENCY_CLIENTS);
    setAllTeamMembers(DEMO_TEAM_MEMBERS);
    logAudit('create', 'Sistema', 'Base redefinida para os dados padrão da demonstração DEMO.');
  };

  const clearAllData = () => {
    setAllClients([]);
    setAllLeads([]);
    setAllDeals([]);
    setAllTasks([]);
    setAllCampaigns([]);
    setAllAgencyClients([]);
    setAllTeamMembers([]);
    logAudit('delete', 'Sistema', 'Dados de produção limpos.');
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        leads,
        deals,
        tasks,
        activities,
        campaigns,
        automations,
        auditLogs,
        aiInsights: allAIInsights,
        integrations,
        agencyClients: allAgencyClients,
        addAgencyClient,
        updateAgencyClient,
        deleteAgencyClient,
        updateAgencyPaymentStatus,
        teamMembers: allTeamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addClient,
        updateClient,
        deleteClient,
        addLead,
        updateLead,
        deleteLead,
        changeLeadStage,
        addDeal,
        updateDeal,
        moveDealStage,
        setDealStatus,
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        addActivity,
        addCampaign,
        updateCampaign,
        toggleAutomation,
        addAutomation,
        toggleIntegration,
        updateIntegrationConfig,
        resetToDemo,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
