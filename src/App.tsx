import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RetailDataProvider } from './context/RetailDataContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Breadcrumbs } from './components/layout/Breadcrumbs';

// Features
import { LoginView } from './features/auth/LoginView';
import { RegisterView } from './features/auth/RegisterView';
import { ForgotPasswordModal } from './features/auth/ForgotPasswordModal';
import { OnboardingView } from './features/auth/OnboardingView';
import { SupabaseSetupModal } from './features/auth/SupabaseSetupModal';

import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { ProfileView } from './features/profile/ProfileView';
import { CompanySettingsView } from './features/tenants/CompanySettingsView';
import { CreateTenantModal } from './features/tenants/CreateTenantModal';
import { TeamManagementView } from './features/team/TeamManagementView';
import { RaonAdminView } from './features/admin/RaonAdminView';
import { SupportView } from './features/support/SupportView';
import { UnderConstructionView } from './features/future-modules/UnderConstructionView';

// Real Retail Operations Modules
import { PosView } from './features/pos/PosView';
import { ProductsView } from './features/products/ProductsView';
import { StockView } from './features/stock/StockView';
import { ClientsView } from './features/clients/ClientsView';
import { SalesHistoryView } from './features/sales/SalesHistoryView';

import { AppNavigationRoute } from './types';

function AppContent() {
  const { isAuthenticated, isLoading, userTenants, currentTenant } = useAuth();

  // Navigation route
  const [currentRoute, setCurrentRoute] = useState<AppNavigationRoute>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auth sub-screens
  const isAutoStoreRegistration = typeof window !== 'undefined' && window.location.search.includes('cadastro=loja');
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>(
    isAutoStoreRegistration ? 'register' : 'login'
  );
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isSupabaseSetupOpen, setIsSupabaseSetupOpen] = useState(false);
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);

  // Check auto-registration link when already authenticated
  useEffect(() => {
    if (isAuthenticated && isAutoStoreRegistration) {
      setIsCreateTenantOpen(true);
    }
  }, [isAuthenticated, isAutoStoreRegistration]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
        <img 
          src="/assets/aistudio/logovarejo_0f870eab.png" 
          alt="Varejou" 
          className="w-16 h-16 object-contain animate-pulse mb-4 filter drop-shadow-xl" 
        />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Carregando ambiente Varejou...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {authScreen === 'login' ? (
          <LoginView
            onSwitchToRegister={() => setAuthScreen('register')}
            onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
            onOpenSupabaseSetup={() => setIsSupabaseSetupOpen(true)}
          />
        ) : (
          <RegisterView
            onSwitchToLogin={() => setAuthScreen('login')}
            onSuccessRegister={() => setAuthScreen('login')}
          />
        )}

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
        />

        <SupabaseSetupModal
          isOpen={isSupabaseSetupOpen}
          onClose={() => setIsSupabaseSetupOpen(false)}
        />
      </>
    );
  }

  // First access check: user has no company created yet
  if (userTenants.length === 0) {
    return (
      <OnboardingView onComplete={() => setCurrentRoute('overview')} />
    );
  }

  // Render view by route
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'overview':
        return <DashboardOverview onNavigate={setCurrentRoute} />;
      case 'pos':
        return <PosView onNavigate={setCurrentRoute} />;
      case 'products':
        return <ProductsView />;
      case 'stock':
        return <StockView />;
      case 'sales':
        return <SalesHistoryView onNavigate={setCurrentRoute} />;
      case 'receivables':
        return <SalesHistoryView onNavigate={setCurrentRoute} />;
      case 'clients':
      case 'credit':
        return <ClientsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <CompanySettingsView />;
      case 'team':
        return <TeamManagementView />;
      case 'raon_admin':
        return <RaonAdminView />;
      case 'support':
        return <SupportView />;
      default:
        return (
          <UnderConstructionView
            route={currentRoute}
            onNavigateOverview={() => setCurrentRoute('overview')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Top Header */}
      <Header
        collapsed={sidebarCollapsed}
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onOpenCreateTenant={() => setIsCreateTenantOpen(true)}
        onOpenSupabaseAssistant={() => setIsSupabaseSetupOpen(true)}
      />

      {/* Main Content Area */}
      <main 
        className={`pt-24 pb-12 px-6 sm:px-8 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            currentRoute={currentRoute}
            tenantName={currentTenant?.name}
            onRouteChange={setCurrentRoute}
          />

          {renderCurrentView()}
        </div>
      </main>

      {/* Global Modals */}
      <CreateTenantModal
        isOpen={isCreateTenantOpen}
        onClose={() => setIsCreateTenantOpen(false)}
      />

      <SupabaseSetupModal
        isOpen={isSupabaseSetupOpen}
        onClose={() => setIsSupabaseSetupOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RetailDataProvider>
          <AppContent />
        </RetailDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
