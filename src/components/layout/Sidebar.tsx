import React from 'react';
import { 
  LayoutDashboard, Users, Flame, CheckSquare, 
  Megaphone, Workflow, FileSpreadsheet, Bot, 
  Share2, DollarSign, Settings, Building2, UserPlus,
  ShieldCheck, Sparkles, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavItem = 
  | 'dashboard'
  | 'clientes_agencia'
  | 'equipe'
  | 'cadastro_empresa'
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
  onOpenOnboardingModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOpenMobile, 
  setIsOpenMobile,
  onOpenOnboardingModal
}) => {
  const { currentUser, currentRole, currentOrg, logout } = useAuth();

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
      id: 'cadastro_empresa', 
      label: 'Cadastrar Empresa (Link)', 
      icon: <UserPlus className="w-4 h-4 text-[#22C55E]" />, 
      badge: 'Convite',
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
    { id: 'tarefas', label: 'Tarefas', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'campanhas', label: 'Campanhas', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'automacoes', label: 'Automações', icon: <Workflow className="w-4 h-4" /> },
    { id: 'paginas_formularios', label: 'Landing Pages & Forms', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'relatorios', label: 'Relatórios', icon: <Share2 className="w-4 h-4" /> },
    { id: 'raon_ai', label: 'RAON AI', icon: <Bot className="w-4 h-4 text-[#38BDF8]" />, badge: 'IA 360°' },
    { id: 'integracoes', label: 'Integrações', icon: <Share2 className="w-4 h-4" /> },
    { id: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (id: NavItem) => {
    if (id === 'cadastro_empresa') {
      if (onOpenOnboardingModal) {
        onOpenOnboardingModal();
      } else {
        setCurrentTab('cadastro_empresa');
      }
    } else {
      setCurrentTab(id);
    }
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

          {/* SÓ A RAON MATRIZ: Fixa & Exclusiva com Botão de Cadastro de Empresa */}
          <div className="mt-3 p-3 rounded-xl bg-[#080B14]/80 border border-[#2563EB]/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0 animate-pulse" />
                <div className="truncate">
                  <div className="text-xs font-extrabold text-white truncate">
                    RAON Matriz — Growth OS
                  </div>
                  <div className="text-[10px] text-[#22C55E] font-mono">
                    Matriz Oficial
                  </div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF7A18]/20 text-[#FF9F43] border border-[#FF7A18]/30 shrink-0">
                HQ
              </span>
            </div>

            <button
              onClick={() => onOpenOnboardingModal && onOpenOnboardingModal()}
              className="w-full py-1.5 px-2 rounded-lg bg-linear-to-r from-[#FF7A18]/20 to-[#FF9F43]/20 hover:from-[#FF7A18]/30 hover:to-[#FF9F43]/30 border border-[#FF7A18]/40 text-[#FF9F43] hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>+ Cadastrar Empresa (Link)</span>
            </button>
          </div>
        </div>

        {/* Method Banner Pill */}
        <div className="px-4 py-2 border-b border-[#151C2C] bg-[#080B14]/40 flex items-center justify-between text-[11px] text-[#94A3B8]">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF7A18]" />
            MÉTODO RAON 360°
          </span>
          <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded font-mono font-semibold">
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
                    item.badge === 'Contratos' || item.badge === 'Convite'
                      ? 'bg-[#FF7A18]/20 text-[#FF9F43] border border-[#FF7A18]/30'
                      : item.badge === 'IA 360°'
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

        {/* Footer: Perfil Único Super Admin — Thiago Pinheiro */}
        <div className="p-3 border-t border-[#151C2C] bg-[#080B14]/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#101522] border border-[#151C2C]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#FF7A18] to-[#2563EB] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                TP
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  Thiago Pinheiro
                </div>
                <div className="text-[10px] text-[#FF9F43] uppercase tracking-wider font-mono flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3 text-[#FF9F43]" />
                  SUPER ADMIN
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
