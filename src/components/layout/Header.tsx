import React, { useState } from 'react';
import { 
  Menu, Search, Bell, Sparkles, UserPlus, 
  CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  onOpenNewLead: () => void;
  onOpenAiChat: () => void;
  onOpenOnboardingModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobile, 
  onOpenSearch, 
  onOpenAiChat,
  onOpenOnboardingModal
}) => {
  const { tasks, agencyClients } = useData();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdueClients = agencyClients.filter(c => c.paymentStatus === 'overdue').length;

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
            <span>Buscar clientes, contratos, tarefas, campanhas...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#080B14] rounded border border-[#151C2C]">
            CTRL + K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Super Admin Badge: Thiago Pinheiro */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#101522] border border-[#FF7A18]/30 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-white font-bold">Thiago Pinheiro</span>
          <span className="text-[10px] text-[#FF9F43] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#FF7A18]/15">
            Super Admin
          </span>
        </div>

        {/* Botão: Cadastrar Nova Empresa / Link de Auto-Cadastro */}
        <button
          onClick={() => onOpenOnboardingModal && onOpenOnboardingModal()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-[#FF7A18]/25"
          title="Cadastrar nova empresa ou copiar link de auto-cadastro para enviar no WhatsApp"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">+ Cadastrar Empresa (Link)</span>
        </button>

        {/* RAON AI Quick Action */}
        <button
          onClick={onOpenAiChat}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#101522] border border-[#38BDF8]/30 hover:border-[#38BDF8] text-xs font-semibold text-[#38BDF8] transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A18]" />
          <span className="hidden md:inline">RAON AI</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#101522] border border-transparent hover:border-[#151C2C] transition relative"
            title="Notificações operacionais"
          >
            <Bell className="w-4 h-4" />
            {overdueClients > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#080B14]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#151C2C]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Notificações RAON
                </span>
                <span className="text-[10px] text-[#22C55E] font-mono">
                  Super Admin
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {overdueClients > 0 ? (
                  <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">
                        {overdueClients} cliente(s) com mensalidade em atraso
                      </div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">
                        Acesse "Clientes da Agência" para enviar lembretes via WhatsApp.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">
                        Mensalidades em dia
                      </div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">
                        Nenhum cliente com pagamento em atraso no momento.
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
                  <span className="text-[#94A3B8]">Tarefas em andamento:</span>
                  <span className="font-mono text-white font-bold">{pendingTasks}</span>
                </div>
              </div>

              <button
                onClick={() => setNotificationsOpen(false)}
                className="w-full py-1.5 rounded-lg bg-[#080B14] hover:bg-[#151C2C] text-[11px] text-[#94A3B8] hover:text-white transition"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
