import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { AppNavigationRoute } from '../../types';

interface BreadcrumbsProps {
  currentRoute: AppNavigationRoute;
  tenantName?: string;
  onRouteChange: (route: AppNavigationRoute) => void;
}

const ROUTE_LABELS: Record<AppNavigationRoute, string> = {
  overview: 'Visão Geral',
  pos: 'Frente de Caixa / PDV',
  sales: 'Vendas',
  products: 'Produtos',
  stock: 'Estoque',
  clients: 'Clientes',
  credit: 'Vendas a Prazo',
  receivables: 'Contas a Receber',
  finance: 'Financeiro',
  expenses: 'Despesas',
  inventory: 'Inventário',
  online_catalog: 'Catálogo Online',
  quotes: 'Cotações',
  deliveries: 'Entregas',
  team: 'Equipe & Permissões',
  reports: 'Relatórios',
  settings: 'Configurações da Empresa',
  profile: 'Meu Perfil',
  raon_admin: 'Painel RAON Admin',
  support: 'Ajuda & Suporte',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentRoute,
  tenantName,
  onRouteChange,
}) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
      <button 
        onClick={() => onRouteChange('overview')}
        className="flex items-center gap-1.5 hover:text-app-primary transition font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{tenantName || 'Lucre+'}</span>
      </button>

      {currentRoute !== 'overview' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {ROUTE_LABELS[currentRoute] || currentRoute}
          </span>
        </>
      )}
    </nav>
  );
};
