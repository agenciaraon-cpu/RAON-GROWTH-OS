import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RaonCommandCenter } from './components/dashboard/RaonCommandCenter';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { ClientsModule } from './components/clients/ClientsModule';
import { AgencyClientsModule } from './components/agency-clients/AgencyClientsModule';
import { TeamModule } from './components/team/TeamModule';
import { ClientOnboardingModal } from './components/clients/ClientOnboardingModal';
import { PublicClientRegistrationView } from './components/clients/PublicClientRegistrationView';
import { CrmModule } from './components/crm/CrmModule';
import { TasksModule } from './components/tasks/TasksModule';
import { CampaignsModule } from './components/campaigns/CampaignsModule';
import { AutomationsModule } from './components/automations/AutomationsModule';
import { PagesAndFormsModule } from './components/pages/PagesAndFormsModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { RaonAiModule } from './components/ai/RaonAiModule';
import { IntegrationsModule } from './components/integrations/IntegrationsModule';
import { FinancialModule } from './components/financial/FinancialModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { LeadModal } from './components/crm/LeadModal';
import { LeadProfileDrawer } from './components/crm/LeadProfileDrawer';
import { testConnection } from './lib/firebase';
import { Lead } from './types';

function AppContent() {
  const { currentRole, currentOrg } = useAuth();
  const { addLead } = useData();

  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);

  // Check if current URL is the public self-registration link for clients
  const [isPublicRegistration, setIsPublicRegistration] = useState(() => {
    if (typeof window === 'undefined') return false;
    const search = window.location.search;
    return search.includes('cadastro=empresa') || search.includes('onboarding=novo_cliente');
  });

  // Global keydown listener for CTRL + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Test Firebase connection on initial boot
  useEffect(() => {
    testConnection();
  }, []);

  const handleSearchResult = (type: string, item: any) => {
    if (type === 'lead') {
      setDrawerLead(item);
      setCurrentTab('crm');
    } else if (type === 'client') {
      setCurrentTab('clientes_agencia');
    } else if (type === 'campaign') {
      setCurrentTab('campanhas');
    }
  };

  const handleSaveLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    addLead(leadData);
    setIsNewLeadOpen(false);
  };

  // If visitor is on the public registration page (?cadastro=empresa)
  if (isPublicRegistration) {
    return (
      <PublicClientRegistrationView
        onFinish={() => {
          window.history.replaceState({}, '', window.location.pathname);
          setIsPublicRegistration(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        onOpenOnboardingModal={() => setIsOnboardingModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenMobile={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNewLead={() => setIsNewLeadOpen(true)}
          onOpenAiChat={() => setCurrentTab('raon_ai')}
          onOpenOnboardingModal={() => setIsOnboardingModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* DASHBOARD ROUTE */}
          {currentTab === 'dashboard' && (
            currentRole === 'super_admin' && currentOrg.id === 'org-raon' ? (
              <RaonCommandCenter
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            ) : (
              <ClientDashboard
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenNewLead={() => setIsNewLeadOpen(true)}
              />
            )
          )}

          {/* CLIENTES DA AGÊNCIA (SUPER ADMIN EXCLUSIVO) */}
          {currentTab === 'clientes_agencia' && (
            <AgencyClientsModule />
          )}

          {/* EQUIPE RAON (SUPER ADMIN EXCLUSIVO) */}
          {currentTab === 'equipe' && (
            <TeamModule />
          )}

          {/* CRM ROUTE */}
          {currentTab === 'crm' && (
            <CrmModule />
          )}

          {/* TAREFAS ROUTE */}
          {currentTab === 'tarefas' && (
            <TasksModule />
          )}

          {/* CAMPANHAS ROUTE */}
          {currentTab === 'campanhas' && (
            <CampaignsModule />
          )}

          {/* AUTOMAÇÕES ROUTE */}
          {currentTab === 'automacoes' && (
            <AutomationsModule />
          )}

          {/* LANDING PAGES & FORMS ROUTE */}
          {currentTab === 'paginas_formularios' && (
            <PagesAndFormsModule />
          )}

          {/* RELATÓRIOS ROUTE */}
          {currentTab === 'relatorios' && (
            <ReportsModule />
          )}

          {/* RAON AI ROUTE */}
          {currentTab === 'raon_ai' && (
            <RaonAiModule />
          )}

          {/* INTEGRAÇÕES ROUTE */}
          {currentTab === 'integracoes' && (
            <IntegrationsModule />
          )}

          {/* FINANCEIRO ROUTE */}
          {currentTab === 'financeiro' && (
            <FinancialModule />
          )}

          {/* CONFIGURAÇÕES ROUTE */}
          {currentTab === 'configuracoes' && (
            <SettingsModule />
          )}
        </main>
      </div>

      {/* Modal: Cadastrar Novo Cliente / Link de Auto-Cadastro */}
      <ClientOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResult}
      />

      {/* Quick New Lead Modal */}
      <LeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSave={handleSaveLead}
      />

      {/* Global Lead Profile Drawer */}
      <LeadProfileDrawer
        lead={drawerLead}
        onClose={() => setDrawerLead(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
