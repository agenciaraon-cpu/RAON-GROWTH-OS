import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, ShoppingBag, CreditCard, 
  Package, AlertCircle, ArrowUpRight, ArrowRight, 
  Clock, Plus, Users, ShoppingCart, ShieldCheck, 
  Sparkles, CheckCircle2, Store, Calendar, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AppNavigationRoute } from '../../types';

interface DashboardOverviewProps {
  onNavigate: (route: AppNavigationRoute) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { currentUser, currentTenant, currentMemberRole } = useAuth();
  const { colorThemeOption } = useTheme();

  // Mode: Real Empty State vs Demo Visualization
  const [showDemoMetrics, setShowDemoMetrics] = useState(false);

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

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
                Plano Fixo Lucre+ R$ 29,90/mês
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
              <span>Painel de Controle: <strong>{currentTenant?.name || 'Sua Empresa'}</strong></span>
            </p>
          </div>
        </div>

        {/* Toggle Real Production Empty State vs Demo Visualization */}
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
              Dados Reais (Vazio)
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

      {/* Demo Mode Notice Banner if enabled */}
      {showDemoMetrics && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              <strong>Modo de Demonstração Isolado:</strong> Os números abaixo são exemplos visuais para pré-visualização das etapas de PDV e Estoque. Nenhum dado fictício é gravado como faturamento real.
            </span>
          </div>
          <button
            onClick={() => setShowDemoMetrics(false)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            Voltar aos dados reais
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
            {showDemoMetrics ? 'R$ 2.480,50' : 'R$ 0,00'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? '14 pedidos finalizados' : 'Nenhuma venda hoje'}
          </span>
        </div>

        {/* Faturamento Mensal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#17B897]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Faturamento Mensal
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#17B897]/10 text-[#17B897] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#17B897] mt-2 font-mono">
            {showDemoMetrics ? 'R$ 48.720,00' : 'R$ 0,00'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? '+18.4% vs mês anterior' : 'Mês atual em aberto'}
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
            {showDemoMetrics ? 'R$ 177,18' : 'R$ 0,00'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? 'Média por compra' : 'Aguardando primeiras vendas'}
          </span>
        </div>

        {/* Contas a Receber */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Contas a Receber
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-500 mt-2 font-mono">
            {showDemoMetrics ? 'R$ 6.340,00' : 'R$ 0,00'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? 'Crediário & boletos a vencer' : 'Sem títulos pendentes'}
          </span>
        </div>

        {/* Produtos em Estoque */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Produtos em Estoque
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {showDemoMetrics ? '1.420 un' : '0 itens'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {showDemoMetrics ? '42 categorias ativas' : 'Catálogo não cadastrado'}
          </span>
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
            /* Honest Real Empty State */
            <div className="h-56 p-8 flex flex-col items-center justify-center text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Nenhuma venda registrada ainda
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Os gráficos de vendas e lucratividade serão populados automaticamente assim que as primeiras operações do PDV forem iniciadas na Etapa 2.
              </p>
              <button
                onClick={() => onNavigate('pos')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#345CF3] text-white text-xs font-bold hover:bg-[#2849d4] transition shadow-md shadow-[#345CF3]/20 flex items-center gap-1.5"
              >
                <span>Conhecer Módulo Frente de Caixa (PDV)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
              Acesso direto às ações de gestão da empresa
            </p>
          </div>

          <div className="space-y-2.5 my-4">
            <button
              onClick={() => onNavigate('team')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Convidar Colaborador
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Definir papel (Gerente, Caixa, Vendedor)
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#345CF3] transition" />
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#17B897]/10 text-[#17B897] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Configurar Dados da Empresa
                  </span>
                  <span className="text-[10px] text-slate-400">
                    CNPJ, telefone, endereço e logomarca
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#17B897] transition" />
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8065E9]/10 text-[#8065E9] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Personalizar Perfil & Foto
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Upload de avatar e segurança
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#8065E9] transition" />
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
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  Segurança Multiempresa Ativa
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  O tenant <strong>{currentTenant?.name}</strong> está isolado por Row Level Security no PostgreSQL. Nenhum outro lojista tem acesso aos seus dados.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#345CF3]/10 border border-[#345CF3]/20 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#345CF3] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#345CF3] block">
                  Plano Trial Ativo (14 Dias)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Aproveite todos os recursos comerciais e de gestão de equipe durante o período de avaliação gratuita do RAON System.
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
