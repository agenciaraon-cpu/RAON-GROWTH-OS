import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, ShoppingBag, CreditCard, 
  Package, Boxes, AlertCircle, ArrowRight, 
  Clock, Users, ShoppingCart, 
  Sparkles, CheckCircle2, Store, Calendar, Cake, Gift, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useRetailData } from '../../context/RetailDataContext';
import { AppNavigationRoute } from '../../types';
import { categorizeBirthdays, MONTH_NAMES_PT } from '../../lib/birthdays';

interface DashboardOverviewProps {
  onNavigate: (route: AppNavigationRoute) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { currentUser, currentTenant, currentMemberRole } = useAuth();
  const { colorThemeOption } = useTheme();
  const { metrics, products, clients, sales } = useRetailData();

  // Mode: Real Store Data vs Demo Visualization
  const [showDemoMetrics, setShowDemoMetrics] = useState(false);

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);
  const averageTicket = metrics.todaySalesCount > 0 
    ? metrics.todayRevenue / metrics.todaySalesCount 
    : 0;

  // Birthdays analysis for Visão Geral notice
  const now = new Date();
  const { today: todayBirthdays, week: weekBirthdays, month: monthBirthdays } = categorizeBirthdays(clients, now);
  const currentMonthName = MONTH_NAMES_PT[now.getMonth()];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-app-primary/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div 
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: colorThemeOption.hex }} 
        />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0E172E] border-2 border-app-primary/40 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
            {currentUser?.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.fullName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-xl font-extrabold text-app-primary">
                {currentUser?.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-app-primary bg-app-light px-2.5 py-0.5 rounded-full border border-app-primary/30">
                {currentTenant ? currentTenant.segment : 'Varejo Comercial'}
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Plano Fixo Varejou R$ 29,90/mês
              </span>
              <span className="text-xs text-slate-400">
                Fuso: America/Bahia
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {greeting}, {currentUser?.fullName}!
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Store className="w-3.5 h-3.5 text-[#17B897]" />
              <span>Painel de Controle: <strong>{currentTenant?.name || 'Sua Loja'}</strong></span>
            </p>
          </div>
        </div>

        {/* Toggle Real Live Data vs Demo Visualization */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-1">
            <button
              onClick={() => setShowDemoMetrics(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                !showDemoMetrics
                  ? 'bg-[#345CF3] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dados Reais da Loja
            </button>
            <button
              onClick={() => setShowDemoMetrics(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showDemoMetrics
                  ? 'bg-[#8065E9] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Demonstração</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerta Automático de Aniversariantes do Mês no Dashboard Principal */}
      {monthBirthdays.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-rose-500/15 via-amber-500/10 to-rose-500/10 border border-rose-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500 text-white">
                  Alerta Automático • Aniversários de {currentMonthName}
                </span>
                {todayBirthdays.length > 0 && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                    {todayBirthdays.length} {todayBirthdays.length === 1 ? 'Aniversariante Hoje!' : 'Aniversariantes Hoje!'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                {monthBirthdays.length} {monthBirthdays.length === 1 ? 'cliente faz aniversário neste mês' : 'clientes fazem aniversário neste mês'}:{' '}
                <span className="font-semibold text-rose-600 dark:text-rose-300">
                  {monthBirthdays.slice(0, 3).map(b => `${b.client.name.split(' ')[0]} (${b.formattedDayMonth})`).join(', ')}
                  {monthBirthdays.length > 3 ? ` e +${monthBirthdays.length - 3}` : ''}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('birthdays')}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shrink-0 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>Ver Aniversariantes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Demo Mode Notice Banner if enabled */}
      {showDemoMetrics && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              <strong>Modo de Demonstração Visual:</strong> Os números abaixo são exemplos visuais. Alterne para "Dados Reais da Loja" para ver seus cadastros e vendas do PDV.
            </span>
          </div>
          <button
            onClick={() => setShowDemoMetrics(false)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer"
          >
            Ver dados da loja
          </button>
        </div>
      )}

      {/* 2. Key Indicator Cards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Vendas do Dia */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#345CF3]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Vendas de Hoje
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {showDemoMetrics ? 'R$ 2.480,50' : `R$ ${metrics.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics 
              ? '14 pedidos finalizados' 
              : `${metrics.todaySalesCount} ${metrics.todaySalesCount === 1 ? 'venda hoje' : 'vendas hoje'}`}
          </span>
        </div>

        {/* Faturamento Mensal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#17B897]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Faturamento do Mês
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#17B897]/10 text-[#17B897] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#17B897] mt-2 font-mono">
            {showDemoMetrics ? 'R$ 48.720,00' : `R$ ${metrics.monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? '+18.4% vs mês anterior' : `${sales.length} vendas registradas`}
          </span>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#8065E9]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#8065E9]/10 text-[#8065E9] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {showDemoMetrics ? 'R$ 177,18' : `R$ ${averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? 'Média por compra' : 'Média por venda no PDV'}
          </span>
        </div>

        {/* Contas a Receber (Crediário) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Crediário a Receber
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-500 mt-2 font-mono">
            {showDemoMetrics ? 'R$ 6.340,00' : `R$ ${metrics.totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? 'Crediário & boletos a vencer' : `${clients.filter(c => c.currentDebt > 0).length} clientes em débito`}
          </span>
        </div>

        {/* Produtos em Estoque */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Produtos & Roupas
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {showDemoMetrics ? '1.420 un' : `${totalStockUnits} un`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? '42 categorias ativas' : `${products.length} itens no catálogo`}
          </span>
        </div>
      </div>

      {/* 2.5. Aviso de Aniversariantes (Dia, Semana e Mês) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-rose-500/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Aviso de Aniversariantes • {currentMonthName}
                </h2>
                {todayBirthdays.length > 0 && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider">
                    {todayBirthdays.length} {todayBirthdays.length === 1 ? 'faz aniversário hoje!' : 'fazem aniversário hoje!'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acompanhe os clientes aniversariantes do dia, da semana e do mês para enviar promoções no WhatsApp.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('birthdays')}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm shrink-0 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>Abrir Aba Aniversariantes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Aniversariantes do Dia */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
                Aniversariantes do Dia
              </span>
              <span className="text-sm font-black font-mono text-rose-500">
                {todayBirthdays.length}
              </span>
            </div>
            {todayBirthdays.length > 0 ? (
              <div className="space-y-1.5">
                {todayBirthdays.slice(0, 2).map(b => (
                  <div key={b.client.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                      {b.client.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const phone = b.client.phone.replace(/\D/g, '');
                        const msg = encodeURIComponent(
                          `Olá ${b.client.name.split(' ')[0]}! Feliz aniversário! A ${currentTenant?.name || 'nossa loja'} preparou uma condição especial para você comemorar hoje!`
                        );
                        window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
                      }}
                      className="px-2 py-1 rounded-lg bg-[#25D366] hover:bg-[#1ebe5b] text-white text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Parabéns</span>
                    </button>
                  </div>
                ))}
                {todayBirthdays.length > 2 && (
                  <span className="text-[10px] text-rose-500 font-semibold block">
                    +{todayBirthdays.length - 2} aniversariante(s) hoje
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nenhum cliente faz aniversário hoje.
              </p>
            )}
          </div>

          {/* Aniversariantes da Semana */}
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-wider">
                Aniversariantes da Semana
              </span>
              <span className="text-sm font-black font-mono text-violet-500">
                {weekBirthdays.length}
              </span>
            </div>
            {weekBirthdays.length > 0 ? (
              <div className="space-y-1">
                {weekBirthdays.slice(0, 2).map(b => (
                  <div key={b.client.id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {b.client.name}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-violet-500 shrink-0">
                      {b.formattedDayMonth}
                    </span>
                  </div>
                ))}
                {weekBirthdays.length > 2 && (
                  <span className="text-[10px] text-violet-500 font-semibold block">
                    +{weekBirthdays.length - 2} na semana
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nenhum aniversário programado nesta semana.
              </p>
            )}
          </div>

          {/* Aniversariantes do Mês */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                Aniversariantes do Mês
              </span>
              <span className="text-sm font-black font-mono text-emerald-500">
                {monthBirthdays.length}
              </span>
            </div>
            {monthBirthdays.length > 0 ? (
              <div className="space-y-1">
                {monthBirthdays.slice(0, 2).map(b => (
                  <div key={b.client.id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {b.client.name}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-500 shrink-0">
                      Dia {String(b.day).padStart(2, '0')}
                    </span>
                  </div>
                ))}
                {monthBirthdays.length > 2 && (
                  <span className="text-[10px] text-emerald-500 font-semibold block">
                    +{monthBirthdays.length - 2} no mês de {currentMonthName}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cadastre datas de nascimento dos clientes para acompanhar.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Sales Graphic + Operational Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart / Real Empty State */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Desempenho Comercial — Vendas Semanais
              </h2>
              <p className="text-xs text-slate-400">
                Acompanhamento diário de fluxo no caixa e faturamento
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Últimos 7 dias
            </span>
          </div>

          {showDemoMetrics ? (
            /* Demo Bars Graphic */
            <div className="pt-4">
              <div className="h-56 flex items-end justify-between gap-3 px-2">
                {[
                  { day: 'Seg', val: 1800, max: 4000 },
                  { day: 'Ter', val: 2400, max: 4000 },
                  { day: 'Qua', val: 2100, max: 4000 },
                  { day: 'Qui', val: 3200, max: 4000 },
                  { day: 'Sex', val: 3850, max: 4000 },
                  { day: 'Sáb', val: 4100, max: 4000 },
                  { day: 'Dom', val: 1400, max: 4000 },
                ].map(item => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                      R$ {item.val}
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl h-44 flex items-end p-1">
                      <div 
                        className="w-full rounded-lg bg-linear-to-t from-[#345CF3] to-[#8065E9] transition-all duration-500 group-hover:opacity-90"
                        style={{ height: `${(item.val / item.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Real State / Call to Action */
            <div className="h-56 p-8 flex flex-col items-center justify-center text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center mb-3">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {sales.length > 0 ? `${sales.length} vendas registradas no sistema` : 'Frente de Caixa (PDV) Pronto para Vender'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Cadastre roupas, sapatos e produtos para lançar vendas rápidas no balcão com cálculo automático de troco e baixa no estoque.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('pos')}
                  className="px-4 py-2 rounded-xl bg-[#345CF3] text-white text-xs font-bold hover:bg-[#2849d4] transition shadow-md shadow-[#345CF3]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Abrir Frente de Caixa (PDV)</span>
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Cadastrar Produtos</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Operational Shortcuts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Atalhos Rápidos de Operação
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ações imediatas para o dia a dia da sua loja
            </p>
          </div>

          <div className="space-y-2.5 my-4">
            <button
              onClick={() => onNavigate('pos')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Frente de Caixa (PDV)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Vender por dinheiro, PIX, cartão e crediário
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#345CF3] transition" />
            </button>

            <button
              onClick={() => onNavigate('products')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#17B897]/10 text-[#17B897] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Cadastrar Roupas & Produtos
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Tamanhos, cores, preço de custo, venda e lucro
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#17B897] transition" />
            </button>

            <button
              onClick={() => onNavigate('clients')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8065E9]/10 text-[#8065E9] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Cadastrar Clientes & WhatsApp
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Limite de crédito, fiado e contato direto
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#8065E9] transition" />
            </button>

            <button
              onClick={() => onNavigate('stock')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Controle de Estoque & Reposição
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ajustes de entrada/saída e alerta de estoque baixo
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Dica: Na <strong>Etapa 2</strong>, este painel receberá botões de ação rápida para abertura de caixa, consulta de estoque em tempo real e emissão de notas.
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Alerts and Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Operacionais */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#345CF3]" />
              <span>Alertas e Notificações do Sistema</span>
            </h2>
            <span className="text-[10px] font-bold text-[#17B897] bg-[#17B897]/15 px-2 py-0.5 rounded-full">
              Operacional
            </span>
          </div>

          <div className="space-y-3">
            {monthBirthdays.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Cake className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                      Aniversariantes Detectados em {currentMonthName} ({monthBirthdays.length})
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {todayBirthdays.length > 0
                        ? `${todayBirthdays.length} cliente(s) comemoram aniversário hoje e ${monthBirthdays.length} neste mês.`
                        : `Você possui ${monthBirthdays.length} cliente(s) fazendo aniversário neste mês.`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('birthdays')}
                  className="text-[11px] font-bold text-rose-500 hover:underline shrink-0 cursor-pointer"
                >
                  Ver lista
                </button>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  Segurança Multiempresa Ativa
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  A loja <strong>{currentTenant?.name}</strong> opera com isolamento exclusivo dos seus clientes, vendas e estoque.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Últimas Atividades */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8065E9]" />
              <span>Últimas Atividades Registradas</span>
            </h2>
            <span className="text-[10px] text-slate-400">
              Trilha de Auditoria
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Acesso de Administrador Realizado',
                desc: `${currentUser?.fullName} autenticou-se com sucesso na empresa ${currentTenant?.name}.`,
                time: 'Há poucos instantes',
                actor: currentUser?.fullName || 'Usuário',
              },
              {
                title: 'Verificação de Políticas de RLS',
                desc: 'Auditoria de isolamento multiempresa e verificação de papéis concluída.',
                time: 'Hoje',
                actor: 'RAON Security Engine',
              },
            ].map((act, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {act.desc}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
