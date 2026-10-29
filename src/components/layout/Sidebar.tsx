import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, ShoppingBag, Package, 
  Boxes, Users, CreditCard, DollarSign, Wallet, 
  Receipt, ClipboardList, Globe, FileText, Truck, 
  UserCheck, BarChart3, Settings, User, ShieldAlert, 
  HelpCircle, ChevronLeft, ChevronRight, Store, Sparkles
} from 'lucide-react';
import { AppNavigationRoute, RoleCode } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentRoute: AppNavigationRoute;
  onRouteChange: (route: AppNavigationRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: AppNavigationRoute;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'primary' | 'warning' | 'soon';
  requiredRoles?: RoleCode[];
  adminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  collapsed,
  onToggleCollapse,
}) => {
  const { currentTenant, currentMemberRole, isPlatformAdmin, hasRole } = useAuth();

  const navigationGroups: NavGroup[] = [
    {
      title: 'PRINCIPAL',
      items: [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERAÇÕES DA LOJA',
      items: [
        { id: 'pos', label: 'Frente de Caixa (PDV)', icon: ShoppingCart, badge: 'Caixa', badgeType: 'primary' },
        { id: 'products', label: 'Roupas & Produtos', icon: Package, badge: 'Catálogo', badgeType: 'primary' },
        { id: 'stock', label: 'Controle de Estoque', icon: Boxes },
        { id: 'sales', label: 'Histórico de Vendas', icon: ShoppingBag },
        { id: 'clients', label: 'Clientes & WhatsApp', icon: Users },
        { id: 'credit', label: 'Crediário & A Prazo', icon: CreditCard },
      ],
    },
    {
      title: 'GESTÃO & CONTROLE',
      items: [
        { id: 'receivables', label: 'Contas a Receber', icon: DollarSign },
        { id: 'finance', label: 'Financeiro', icon: Wallet, badge: 'Etapa 2', badgeType: 'soon' },
        { id: 'expenses', label: 'Despesas', icon: Receipt, badge: 'Etapa 2', badgeType: 'soon' },
        { id: 'inventory', label: 'Inventário Físico', icon: ClipboardList, badge: 'Etapa 2', badgeType: 'soon' },
        { id: 'online_catalog', label: 'Catálogo Online', icon: Globe, badge: 'Etapa 2', badgeType: 'soon' },
      ],
    },
    {
      title: 'EMPRESA & CONFIGURAÇÕES',
      items: [
        { 
          id: 'team', 
          label: 'Equipe & Permissões', 
          icon: UserCheck, 
          requiredRoles: ['owner', 'manager'] 
        },
        { 
          id: 'settings', 
          label: 'Configurações da Loja', 
          icon: Settings, 
          requiredRoles: ['owner', 'manager'] 
        },
        { id: 'reports', label: 'Relatórios', icon: BarChart3, badge: 'Etapa 2', badgeType: 'soon' },
      ],
    },
    {
      title: 'CONTA & SISTEMA',
      items: [
        { id: 'profile', label: 'Meu Perfil', icon: User },
        { 
          id: 'raon_admin', 
          label: 'Painel RAON Admin', 
          icon: ShieldAlert, 
          badge: 'SuperAdmin',
          badgeType: 'warning',
          adminOnly: true 
        },
        { id: 'support', label: 'Ajuda & Suporte', icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-72'
      } bg-[#FFFFFF] dark:bg-[#0B1225] border-slate-200 dark:border-slate-800/80 shadow-xs`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-18 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-app-gradient flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md shadow-app-glow">
              V
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base">
                    Varejou
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-app-light text-app-primary uppercase tracking-wider">
                    SaaS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate max-w-[170px]">
                  Sua loja. Seu controle.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
            title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Tenant Badge (if expanded) */}
        {!collapsed && currentTenant && (
          <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#17B897]/15 text-[#17B897] flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="truncate flex-1">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                Empresa Ativa
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {currentTenant.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navigationGroups.map((group, gIdx) => {
          // Filter items based on user role and admin status
          const visibleItems = group.items.filter(item => {
            if (item.adminOnly && !isPlatformAdmin) return false;
            if (item.requiredRoles && !hasRole(item.requiredRoles)) return false;
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase mb-1">
                  {group.title}
                </div>
              )}

              {visibleItems.map(item => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onRouteChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-app-primary text-white shadow-sm shadow-app-glow font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`} />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">
                        {item.label}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeType === 'primary'
                          ? 'bg-app-light text-app-primary'
                          : item.badgeType === 'warning'
                          ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                          : 'bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60">
        {!collapsed ? (
          <div className="px-2 py-1 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">
              Varejou • v1.0.0
            </span>
            <span className="text-[9px] text-[#17B897] font-semibold">
              Ambiente Seguro • PostgreSQL
            </span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#17B897] mx-auto" title="Varejou Ativo" />
        )}
      </div>
    </aside>
  );
};
