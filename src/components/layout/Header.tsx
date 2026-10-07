import React, { useState } from 'react';
import { 
  Menu, Search, Bell, Sparkles, Database, Plus, 
  CheckCircle2, AlertTriangle, ArrowRight, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  onOpenNewLead: () => void;
  onOpenAiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobile, 
  onOpenSearch, 
  onOpenNewLead,
  onOpenAiChat
}) => {
  const { currentRole, switchRole, isDemoMode, setIsDemoMode, currentOrg } = useAuth();
  const { resetToDemo, clearAllData, leads, tasks } = useData();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'overdue').length;
  const newLeadsCount = leads.filter(l => l.stage === 'novo_lead').length;

  return (
    <header className="sticky top-0 z-30 bg-[#080B14]/90 backdrop-blur-md border-b border-[#151C2C] px-4 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151C2C] lg:hidden transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition text-left group"
        >
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] group-hover:text-white transition">
            <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8]" />
            <span>Buscar clientes, leads, negócios, tarefas...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#080B14] rounded border border-[#151C2C]">
            CTRL + K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DEMO DATA Banner badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF7A18]/10 border border-[#FF7A18]/30 text-xs font-mono font-semibold text-[#FF9F43]">
          <Database className="w-3.5 h-3.5" />
          <span>DEMO DATA</span>
          <button 
            onClick={() => {
              if (window.confirm('Deseja recarregar os dados padrões da demonstração?')) {
                resetToDemo();
              }
            }}
            title="Recarregar dados demo originais"
            className="ml-1 text-[10px] text-[#38BDF8] hover:underline"
          >
            Resetar
          </button>
        </div>

        {/* Role Quick Selector */}
        <div className="hidden lg:flex items-center bg-[#101522] rounded-lg p-1 border border-[#151C2C] text-xs">
          <button
            onClick={() => switchRole('super_admin')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              currentRole === 'super_admin'
                ? 'bg-[#FF7A18] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Super Admin
          </button>
          <button
            onClick={() => switchRole('client_admin')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              currentRole === 'client_admin'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Client Admin
          </button>
          <button
            onClick={() => switchRole('sales_user')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              currentRole === 'sales_user'
                ? 'bg-[#22C55E] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Comercial
          </button>
        </div>

        {/* RAON AI Quick Action */}
        <button
          onClick={onOpenAiChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-[#2563EB]/20 to-[#38BDF8]/20 border border-[#38BDF8]/40 hover:border-[#38BDF8] text-xs font-semibold text-[#38BDF8] transition shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A18]" />
          <span className="hidden sm:inline">RAON AI</span>
        </button>

        {/* New Lead Quick Action */}
        <button
          onClick={onOpenNewLead}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF7A18] hover:bg-[#FF9F43] text-white text-xs font-semibold transition shadow-md shadow-[#FF7A18]/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Novo Lead</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#101522] transition relative"
            title="Notificações operacionais"
          >
            <Bell className="w-4 h-4" />
            {(pendingTasks > 0 || newLeadsCount > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7A18] ring-2 ring-[#080B14]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#101522] border border-[#151C2C] rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#151C2C]">
                <span className="text-xs font-semibold text-white">Central de Alertas</span>
                <span className="text-[10px] text-[#38BDF8] font-mono">Em tempo real</span>
              </div>
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                <div className="p-2 rounded-lg bg-[#151C2C]/50 border border-[#2563EB]/20 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#38BDF8]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{newLeadsCount} Novos Leads Aguardando</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Leads captados nas últimas 24h prontos para primeiro contato.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#151C2C]/50 border border-[#FF7A18]/20 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#FF9F43]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{pendingTasks} Tarefas Comerciais Pendentes</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Follow-ups e propostas com prazo de atendimento no CRM.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#151C2C]/50 border border-[#22C55E]/20 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#22C55E]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Meta Mensal em 78%</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Projeção indica fechamento em R$ 460.000 até o fim do ciclo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
