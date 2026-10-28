import React from 'react';
import { 
  ShieldAlert, Building2, Users, CreditCard, 
  Activity, CheckCircle2, Clock, AlertTriangle, 
  Sparkles, ExternalLink, ShieldCheck, Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const RaonAdminView: React.FC = () => {
  const { isPlatformAdmin, userTenants, currentUser } = useAuth();

  if (!isPlatformAdmin) {
    return (
      <div className="p-12 text-center max-w-md mx-auto bg-white dark:bg-[#0E172E] rounded-3xl border border-red-500/20 shadow-xl space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Acesso Restrito ao SuperAdmin RAON
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Esta área é restrita a administradores globais da plataforma RAON. Usuários lojistas e colaboradores não possuem acesso administrativo.
        </p>
      </div>
    );
  }

  // System statistics
  const totalTenants = userTenants.length;
  const activeTenants = userTenants.filter(t => t.status === 'active').length;
  const trialTenants = userTenants.filter(t => t.status === 'trial' || t.status === 'active').length;

  const plans = [
    {
      name: 'Plano Fixo Lucre+',
      price: 'R$ 29,90/mês',
      limits: 'Acesso completo e irrestrito ao sistema',
      features: 'PDV / Caixa, Vendas, Produtos & Estoque, Clientes, Vendas a Prazo, Financeiro, Gestão de Equipe e Suporte',
      activeSubs: activeTenants,
      status: 'Plano Único Fixo',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Superadmin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              PLATAFORMA GLOBAL — SUPERADMIN
            </span>
            <span className="text-xs text-slate-400">
              Operação Lucre+
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Painel Administrativo Lucre+
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Supervisão geral de empresas varejistas, plano fixo de R$ 29,90/mês, assinaturas e status do Supabase.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Admin Autenticado</span>
          <span className="text-xs font-bold text-amber-400">{currentUser?.fullName}</span>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Empresas</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {totalTenants}
          </div>
          <span className="text-[11px] text-emerald-500 mt-1 block font-medium">
            100% isoladas no banco
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Empresas Ativas</span>
          <div className="text-2xl font-extrabold text-[#17B897] mt-1 font-mono">
            {activeTenants}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Em operação regular
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Em Período de Teste (Trial)</span>
          <div className="text-2xl font-extrabold text-amber-500 mt-1 font-mono">
            {trialTenants}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            14 dias gratuitos ativos
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Banco de Dados</span>
          <div className="text-lg font-bold text-[#345CF3] mt-2 flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            <span>{isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Sandbox'}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            RLS Habilitado
          </span>
        </div>
      </div>

      {/* Plans & Subscriptions Overview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Planos & Estrutura de Assinaturas SaaS
            </h2>
            <p className="text-xs text-slate-400">
              Modelos de assinatura preparados para o varejo (Etapa 1: sem cobranças reais simuladas)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(p => (
            <div key={p.name} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border-2 border-app-primary/30 flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-app-light rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-app-light text-app-primary border border-app-primary/30">
                    {p.status}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-app-primary font-mono my-2 flex items-baseline gap-1">
                  <span>{p.price}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">fixo sem surpresas</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {p.limits}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Incluso: {p.features}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                <span>Empresas ativas neste plano:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{p.activeSubs} lojas</strong>
              </div>
            </div>
          ))}

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-center space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Política de Preço Lucre+
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O modelo de plano único a R$ 29,90/mês garante previsibilidade para os lojistas do varejo, sem custos extras por emissão de comprovantes, cadastros de produtos ou usuários adicionais.
            </p>
            <div className="pt-2 text-[11px] text-[#17B897] font-semibold flex items-center gap-1.5">
              <span>✓ Período de teste gratuito de 14 dias para todas as novas empresas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Tenants List (Privacidade Preservada: sem expor dados comerciais dos lojistas) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Empresas Lojistas Registradas
            </h2>
            <p className="text-xs text-slate-400">
              Conformidade com a regra: administradores da plataforma não acessam dados comerciais privados dos lojistas
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">Empresa</th>
                <th className="py-2.5 px-3">Segmento</th>
                <th className="py-2.5 px-3">Contato</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Isolamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {userTenants.map(t => (
                <tr key={t.id}>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                    {t.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {t.segment}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {t.phone || '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      Ativa
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[10px] font-mono">
                    RLS Ativo (tenant_id UUID)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
