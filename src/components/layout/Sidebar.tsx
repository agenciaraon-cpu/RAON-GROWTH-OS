import React from 'react';
import { 
  LayoutDashboard, Users, Flame, CheckSquare, 
  Megaphone, Workflow, FileSpreadsheet, Bot, 
  Share2, DollarSign, Settings, Building2, ChevronDown, 
  ShieldCheck, ShieldAlert, Sparkles, LogOut, ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavItem = 
  | 'dashboard'
  | 'clientes_agencia'
  | 'equipe'
  | 'clientes'
  | 'crm'
  | 'tarefas'
  | 'campanhas'
  | 'automacoes'
  | 'paginas_formularios'
  | 'relatorios'
  | 'raon_ai'
  | 'integracoes'
  | 'financeiro'
  | 'configuracoes';

interface SidebarProps {
  currentTab: NavItem;
  setCurrentTab: (tab: NavItem) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOpenMobile, 
  setIsOpenMobile 
}) => {
  const { currentUser, currentRole, currentOrg, organizations, switchOrganization, switchRole, logout } = useAuth();
  const [orgDropdownOpen, setOrgDropdownOpen] = React.useState(false);

  const menuItems: { id: NavItem; label: string; icon: React.ReactNode; badge?: string; superAdminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'clientes_agencia', 
      label: 'Clientes da Agência', 
      icon: <Building2 className="w-4 h-4 text-[#FF7A18]" />, 
      badge: 'Contratos',
      superAdminOnly: true 
    },
    { 
      id: 'equipe', 
      label: 'Equipe RAON', 
      icon: <Users className="w-4 h-4 text-[#38BDF8]" />, 
      badge: 'Time',
      superAdminOnly: true 
    },
    { id: 'crm', label: 'CRM & Pipeline', icon: <Flame className="w-4 h-4" />, badge: 'Pro' },
    { id: 'clientes', label: 'Tenants / Empresas', icon: <Building2 className="w-4 h-4" /> },
    { id: 'tarefas', label: 'Tarefas', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'campanhas', label: 'Campanhas', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'automacoes', label: 'Automações', icon: <Workflow className="w-4 h-4" /> },
    { id: 'paginas_formularios', label: 'Landing Pages & Forms', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'relatorios', label: 'Relatórios', icon: <Share2 className="w-4 h-4" /> },
    { id: 'raon_ai', label: 'RAON AI', icon: <Bot className="w-4 h-4 text-[#38BDF8]" />, badge: 'IA 360°' },
    { id: 'integracoes', label: 'Integrações', icon: <Share2 className="w-4 h-4" /> },
    { id: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'configuracoes', label: 'Configurações & Auditoria', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (id: NavItem) => {
    setCurrentTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs" 
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#101522] border-r border-[#151C2C] flex flex-col
        transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#151C2C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#FF7A18] to-[#2563EB] flex items-center justify-center shadow-lg shadow-[#FF7A18]/20 font-black text-white text-base tracking-wider">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">RAON</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-[#FF7A18]/20 text-[#FF9F43] border border-[#FF7A18]/30">
                  GROWTH OS
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
                Marketing, IA & Tecnologia
              </p>
            </div>
          </div>

          {/* Tenant Switcher Card */}
          <div className="mt-3 relative">
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[#080B14]/70 border border-[#151C2C] hover:border-[#38BDF8]/40 transition text-left group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0 animate-pulse" />
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate group-hover:text-[#38BDF8] transition">
                    {currentOrg.name}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    Plano {currentOrg.plan}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white shrink-0 ml-1" />
            </button>

            {/* Switcher dropdown */}
            {orgDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#151C2C] border border-[#2563EB]/40 rounded-lg shadow-2xl p-1 z-50">
                <div className="px-2 py-1 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Trocar Organização / Cliente
                </div>
                {organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrganization(org.id);
                      setOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-left transition ${
                      org.id === currentOrg.id 
                        ? 'bg-[#2563EB]/20 text-[#38BDF8] font-semibold' 
                        : 'text-[#94A3B8] hover:bg-[#101522] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{org.name}</span>
                    <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono ml-2">
                      {org.segment.slice(0, 8)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Method Banner Pill */}
        <div className="px-4 py-2 border-b border-[#151C2C] bg-[#080B14]/40 flex items-center justify-between text-[11px] text-[#94A3B8]">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF7A18]" />
            MÉTODO RAON 360°
          </span>
          <span className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded">
            Ativo
          </span>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {menuItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-[#2563EB]/25 to-[#38BDF8]/10 text-white border-l-2 border-[#FF7A18] font-semibold shadow-xs'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#151C2C]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    item.badge === 'IA 360°'
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30'
                      : 'bg-[#151C2C] text-[#94A3B8]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: User profile & quick role switch */}
        <div className="p-3 border-t border-[#151C2C] bg-[#080B14]/80">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101522] border border-[#151C2C]">
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-full object-cover border border-[#2563EB]/30 shrink-0" 
              />
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono flex items-center gap-1">
                  {currentRole === 'super_admin' ? (
                    <span className="text-[#FF9F43] flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> SUPER ADMIN
                    </span>
                  ) : currentRole === 'client_admin' ? (
                    <span className="text-[#38BDF8] flex items-center gap-0.5">
                      <ShieldAlert className="w-2.5 h-2.5" /> CLIENT ADMIN
                    </span>
                  ) : (
                    <span className="text-[#22C55E]">SALES USER</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick role switch trigger */}
            <div className="flex items-center gap-1">
              <button
                title="Alternar Perfil (Simulação de Perfil)"
                onClick={() => {
                  const nextRole = 
                    currentRole === 'super_admin' ? 'client_admin' : 
                    currentRole === 'client_admin' ? 'sales_user' : 'super_admin';
                  switchRole(nextRole);
                }}
                className="p-1.5 rounded text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#151C2C] transition"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
              <button
                title="Sair / Reset"
                onClick={logout}
                className="p-1.5 rounded text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#151C2C] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
