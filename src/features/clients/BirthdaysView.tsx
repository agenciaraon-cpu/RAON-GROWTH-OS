import React, { useState } from 'react';
import { 
  Cake, Calendar, MessageSquare, Gift, Users, 
  Sparkles, Search, Phone, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';
import { categorizeBirthdays, MONTH_NAMES_PT, BirthdayClientInfo } from '../../lib/birthdays';
import { AppNavigationRoute } from '../../types';

interface BirthdaysViewProps {
  onNavigate?: (route: AppNavigationRoute) => void;
}

export const BirthdaysView: React.FC<BirthdaysViewProps> = ({ onNavigate }) => {
  const { clients } = useRetailData();
  const { currentTenant } = useAuth();

  const [periodTab, setPeriodTab] = useState<'todos_mes' | 'hoje' | 'semana' | 'todos'>('todos_mes');
  const [search, setSearch] = useState('');
  const [promoTemplate, setPromoTemplate] = useState(
    'Olá {nome}! A {loja} deseja um Feliz Aniversário repleto de alegria! Como presente especial, preparamos 15% OFF na sua próxima compra conosco!'
  );

  const now = new Date();
  const { all, today, week, month } = categorizeBirthdays(clients, now);
  const currentMonthName = MONTH_NAMES_PT[now.getMonth()];

  const baseList: BirthdayClientInfo[] =
    periodTab === 'hoje' ? today :
    periodTab === 'semana' ? week :
    periodTab === 'todos_mes' ? month :
    all;

  const filteredList = baseList.filter(item => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.client.name.toLowerCase().includes(q) ||
      item.client.phone.includes(q) ||
      item.formattedDate.includes(q) ||
      (item.client.cpf && item.client.cpf.includes(q))
    );
  });

  const handleSendWhatsAppPromo = (item: BirthdayClientInfo) => {
    const cleanPhone = item.client.phone.replace(/\D/g, '');
    if (!cleanPhone) return;
    const firstName = item.client.name.split(' ')[0];
    const storeName = currentTenant?.name || 'nossa loja';
    const message = promoTemplate
      .replace(/\{nome\}/g, firstName)
      .replace(/\{loja\}/g, storeName);
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-rose-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30 flex items-center gap-1">
              <Cake className="w-3 h-3" />
              ANIVERSARIANTES & PROMOÇÕES
            </span>
            <span className="text-xs text-slate-400">
              {currentMonthName} • {currentTenant?.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Painel de Aniversariantes
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Acompanhe os clientes que fazem aniversário hoje, nesta semana e neste mês para enviar felicitações e cupons promocionais pelo WhatsApp.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('clients')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition shrink-0 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Gerenciar Clientes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* KPI Cards: Dia, Semana, Mês, Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setPeriodTab('hoje')}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer ${
            periodTab === 'hoje'
              ? 'bg-rose-500/10 border-rose-500 shadow-md'
              : 'bg-white dark:bg-[#0E172E] border-slate-200 dark:border-slate-800 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
              Aniversariantes do Dia
            </span>
            <Cake className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {today.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
            {today.length > 0 ? today.map(t => t.client.name.split(' ')[0]).join(', ') : 'Nenhum hoje'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPeriodTab('semana')}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer ${
            periodTab === 'semana'
              ? 'bg-violet-500/10 border-violet-500 shadow-md'
              : 'bg-white dark:bg-[#0E172E] border-slate-200 dark:border-slate-800 hover:border-violet-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">
              Aniversariantes da Semana
            </span>
            <Calendar className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {week.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Comemoram nesta semana
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPeriodTab('todos_mes')}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer ${
            periodTab === 'todos_mes'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-md'
              : 'bg-white dark:bg-[#0E172E] border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
              Aniversariantes do Mês
            </span>
            <Gift className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {month.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Mês de {currentMonthName}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPeriodTab('todos')}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer ${
            periodTab === 'todos'
              ? 'bg-[#345CF3]/10 border-[#345CF3] shadow-md'
              : 'bg-white dark:bg-[#0E172E] border-slate-200 dark:border-slate-800 hover:border-[#345CF3]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#345CF3] uppercase tracking-wider">
              Total com Data Cadastrada
            </span>
            <Users className="w-4 h-4 text-[#345CF3]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {all.length} <span className="text-xs font-sans text-slate-400">/ {clients.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Próximos aniversários do ano
          </span>
        </button>
      </div>

      {/* Mensagem Personalizável de Promoção */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mensagem Padrão de Aniversário & Promoção (WhatsApp)</span>
          </label>
          <span className="text-[10px] text-slate-400">
            Use {'{nome}'} e {'{loja}'} para personalizar automaticamente
          </span>
        </div>
        <textarea
          rows={2}
          value={promoTemplate}
          onChange={e => setPromoTemplate(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:border-app-primary"
        />
      </div>

      {/* Filtros + Busca */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar aniversariante por nome, celular, CPF ou data..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
          />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto">
          {[
            { id: 'hoje', label: `Do Dia (${today.length})` },
            { id: 'semana', label: `Da Semana (${week.length})` },
            { id: 'todos_mes', label: `Do Mês (${month.length})` },
            { id: 'todos', label: `Todos (${all.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPeriodTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                periodTab === tab.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Aniversariantes */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 space-y-2">
          <Cake className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Nenhum aniversariante encontrado para este período.
          </p>
          <p className="text-[11px]">
            Certifique-se de informar a data de nascimento ao cadastrar ou editar seus clientes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map(item => (
            <div
              key={item.client.id}
              className={`p-5 rounded-3xl border shadow-xs flex flex-col justify-between gap-4 transition ${
                item.isToday
                  ? 'bg-rose-500/5 border-rose-500/40 ring-1 ring-rose-500/20'
                  : item.isThisWeek
                  ? 'bg-white dark:bg-[#0E172E] border-violet-500/30'
                  : 'bg-white dark:bg-[#0E172E] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {item.client.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                      <Phone className="w-3 h-3 text-[#17B897]" />
                      <span>{item.client.phone}</span>
                    </div>
                  </div>

                  {item.isToday ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Cake className="w-3 h-3" /> Hoje!
                    </span>
                  ) : item.isThisWeek ? (
                    <span className="px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 text-[10px] font-bold shrink-0">
                      Esta Semana
                    </span>
                  ) : item.isThisMonth ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                      Este Mês
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold shrink-0">
                      Em {item.daysUntil}d
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Aniversário</span>
                    <strong className="font-mono text-slate-900 dark:text-white">
                      {item.formattedDate}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Idade / Ciclo</span>
                    <strong className="text-rose-500 font-bold">
                      {item.ageTurning > 0 ? `${item.ageTurning} anos` : item.formattedDayMonth}
                    </strong>
                  </div>
                </div>

                {item.client.cpf && (
                  <p className="text-[10px] text-slate-400 font-mono">
                    CPF: {item.client.cpf}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSendWhatsAppPromo(item)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Promoção no WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
