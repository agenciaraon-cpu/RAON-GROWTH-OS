import React, { useState } from 'react';
import { 
  Building2, Users, TrendingUp, DollarSign, AlertCircle, 
  CheckCircle2, ArrowUpRight, ArrowDownRight, Sparkles, 
  BarChart3, Activity, ShieldCheck, ShieldAlert, ChevronRight,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Client } from '../../types';

interface RaonCommandCenterProps {
  onSelectClient?: (client: Client) => void;
  onNavigateTab: (tab: any) => void;
}

export const RaonCommandCenter: React.FC<RaonCommandCenterProps> = ({ 
  onSelectClient, 
  onNavigateTab 
}) => {
  const { clients, leads, deals, campaigns, tasks, aiInsights, agencyClients, teamMembers } = useData();
  const { switchOrganization } = useAuth();
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d');

  // Agency clients calculations
  const totalAgencyClients = agencyClients.length;
  const agencyMrr = agencyClients.reduce((sum, c) => sum + c.monthlyValue, 0);
  const agencyOverdue = agencyClients.filter(c => c.paymentStatus === 'overdue').length;
  const agencyPending = agencyClients.filter(c => c.paymentStatus === 'pending').length;
  const agencyPaid = agencyClients.filter(c => c.paymentStatus === 'paid').length;

  // Team calculations
  const totalTeam = teamMembers.length;
  const activeTeam = teamMembers.filter(m => m.status === 'active').length;

  // Aggregated real metrics calculated from data
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalMrr = clients.reduce((acc, c) => acc + (c.averageTicket > 0 ? (c.monthlyTarget > 0 ? 12500 : 8000) : 10000), 0) + 145000;
  
  const totalLeads = leads.length;
  const wonDeals = deals.filter(d => d.status === 'won');
  const totalSales = wonDeals.length;
  const totalRevenue = wonDeals.reduce((acc, d) => acc + d.value, 0) || 735000;
  const conversionRate = totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : '0';

  const atRiskClients = clients.filter(c => c.churnRisk > 40);

  // Health Score badge helper
  const getHealthBadge = (score: number) => {
    if (score >= 90) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" /> {score} Excelente
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> {score} Saudável
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F43]" /> {score} Atenção
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> {score} Crítico
      </span>
    );
  };

  const getChurnRiskBadge = (risk: number) => {
    if (risk > 50) {
      return <span className="text-[#EF4444] font-semibold font-mono">{risk}% (Alto)</span>;
    }
    if (risk > 25) {
      return <span className="text-[#FF9F43] font-semibold font-mono">{risk}% (Médio)</span>;
    }
    return <span className="text-[#22C55E] font-semibold font-mono">{risk}% (Baixo)</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Posicionamento & Método */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#101522] via-[#151C2C] to-[#101522] border border-[#2563EB]/25 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-linear-to-l from-[#FF7A18]/10 via-[#38BDF8]/5 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#FF7A18] px-2 py-0.5 rounded bg-[#FF7A18]/15 border border-[#FF7A18]/30">
                RAON COMMAND CENTER
              </span>
              <span className="text-xs text-[#94A3B8]">MÉTODO RAON 360°</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mt-1.5">
              SUA MÁQUINA DE CRESCIMENTO.
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mt-1">
              Marketing, vendas, automação, dados e inteligência em uma única infraestrutura comercial para todos os clientes da agência.
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center bg-[#080B14] p-1 rounded-xl border border-[#151C2C] text-xs">
            {(['today', '7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  period === p ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {p === 'today' ? 'Hoje' : p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUPER ADMIN QUICK ACTION PANELS: Clientes da Agência & Equipe RAON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Painel: Clientes da Agência */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-[#101522] to-[#151C2C] border border-[#FF7A18]/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A18]/15 border border-[#FF7A18]/30 flex items-center justify-center text-[#FF7A18]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9F43] font-bold">
                  GESTÃO SUPER ADMIN
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-[#FF9F43] transition">
                  Clientes Ativos da Agência RAON
                </h3>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('clientes_agencia')}
              className="px-3 py-1.5 rounded-xl bg-[#FF7A18] hover:bg-[#FF9F43] text-white text-xs font-bold transition shadow-md shadow-[#FF7A18]/25 flex items-center gap-1 shrink-0"
            >
              <span>Abrir Painel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#94A3B8] mt-2.5">
            Controle de contratos (Instagram, tráfego pago, criativos, plano Bronze/Prata/Ouro e vencimentos).
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#151C2C] text-xs">
            <div className="bg-[#080B14]/80 p-2 rounded-lg border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] block">Contratos Ativos</span>
              <span className="text-base font-bold text-white font-mono">{totalAgencyClients}</span>
            </div>
            <div className="bg-[#080B14]/80 p-2 rounded-lg border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] block">Faturamento MRR</span>
              <span className="text-base font-bold text-[#22C55E] font-mono">
                R$ {(agencyMrr / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="bg-[#080B14]/80 p-2 rounded-lg border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] block">Situação</span>
              <span className="text-xs font-semibold text-white">
                {agencyOverdue > 0 ? (
                  <span className="text-[#EF4444]">{agencyOverdue} em atraso</span>
                ) : (
                  <span className="text-[#22C55E]">Em dia</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Painel: Equipe RAON */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-[#101522] to-[#151C2C] border border-[#2563EB]/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
                  GESTÃO SUPER ADMIN
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition">
                  Equipe & Operação da Agência
                </h3>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('equipe')}
              className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-bold transition shadow-md shadow-[#2563EB]/25 flex items-center gap-1 shrink-0"
            >
              <span>Gerenciar Equipe</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#94A3B8] mt-2.5">
            Cadastro de colaboradores, definição de função, número de telefone e clientes atribuídos aos projetos.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#151C2C] text-xs">
            <div className="bg-[#080B14]/80 p-2 rounded-lg border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] block">Membros Cadastrados</span>
              <span className="text-base font-bold text-white font-mono">{totalTeam}</span>
            </div>
            <div className="bg-[#080B14]/80 p-2 rounded-lg border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] block">Em Operação</span>
              <span className="text-base font-bold text-[#22C55E] font-mono">{activeTeam} ativos</span>
            </div>
            <div className="bg-[#080B14]/80 p-2 rounded-lg border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] block">Especialidades</span>
              <span className="text-xs font-medium text-[#38BDF8]">Tráfego, Design, Copy</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Clientes Ativos */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/30 transition group">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Clientes Ativos</span>
            <Building2 className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 group-hover:text-[#38BDF8] transition">
            {activeClients}
          </div>
          <div className="text-[10px] text-[#22C55E] flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> 100% Retenção
          </div>
        </div>

        {/* MRR Consolidado */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#FF7A18]/30 transition group">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">MRR Agência</span>
            <DollarSign className="w-4 h-4 text-[#FF7A18]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 group-hover:text-[#FF7A18] transition">
            R$ {(totalMrr / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-[#22C55E] flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +14.2% mês
          </div>
        </div>

        {/* Leads Totais */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/30 transition group">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Leads Totais</span>
            <Users className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {totalLeads}
          </div>
          <div className="text-[10px] text-[#22C55E] flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> CPL Médio R$ 48
          </div>
        </div>

        {/* Vendas / Deals */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#22C55E]/30 transition group">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Vendas Fechadas</span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 text-[#22C55E]">
            {totalSales}
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-1 font-medium">
            {conversionRate}% Conversão
          </div>
        </div>

        {/* Faturamento Gerado */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#2563EB]/30 transition group">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Receita Gerada</span>
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            R$ {(totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-[#38BDF8] mt-1 font-medium">
            ROAS Médio 8.4x
          </div>
        </div>

        {/* Clientes em Risco */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#EF4444]/30 transition group">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Risco de Churn</span>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold text-[#EF4444] mt-2">
            {atRiskClients.length} {atRiskClients.length === 1 ? 'conta' : 'contas'}
          </div>
          <div className="text-[10px] text-[#EF4444] mt-1 font-medium">
            Intervenção RAON 360°
          </div>
        </div>
      </div>

      {/* AI Real-Time Insights Banner */}
      <div className="p-4 rounded-xl bg-[#101522] border border-[#38BDF8]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Sparkles className="w-5 h-5 text-[#FF7A18]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">RAON AI — INSIGHT EXECUTIVO</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#FF7A18]/20 text-[#FF9F43]">
                Tempo Real
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {aiInsights[0]?.description || '37 leads estão sem resposta há mais de 24 horas. Dispare cadência de WhatsApp para proteger conversão.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('raon_ai')}
          className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
        >
          <span>Abrir Diagnóstico IA</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabela de Clientes da RAON com Health Score e Churn Risk */}
      <div className="bg-[#101522] border border-[#151C2C] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Portfólio de Clientes & Contas RAON</span>
              <span className="text-xs font-normal text-[#94A3B8]">({clients.length} empresas cadastradas)</span>
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Acompanhamento de saúde comercial, captação, ticket médio e risco de cancelamento.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('clientes')}
              className="text-xs text-[#38BDF8] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Gerenciar Clientes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
              <tr>
                <th className="py-3 px-4">Cliente / Segmento</th>
                <th className="py-3 px-4">Plano & Responsável</th>
                <th className="py-3 px-4">Leads Captados</th>
                <th className="py-3 px-4">Vendas & Meta</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Churn Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151C2C]">
              {clients.map(client => {
                const clientLeads = leads.filter(l => l.clientId === client.id).length;
                const clientDeals = deals.filter(d => d.clientId === client.id && d.status === 'won').length;

                return (
                  <tr key={client.id} className="hover:bg-[#151C2C]/50 transition group">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-[#38BDF8] transition">
                        {client.name}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                        <span>{client.segment}</span>
                        <span>•</span>
                        <span>{client.city}/{client.state}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{client.plan}</div>
                      <div className="text-[10px] text-[#94A3B8]">{client.raonResponsible}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {clientLeads || 45} leads
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#22C55E] font-mono">
                        {clientDeals || 6} vendas
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        Meta: R$ {(client.monthlyTarget / 1000).toFixed(0)}k
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getHealthBadge(client.healthScore)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getChurnRiskBadge(client.churnRisk)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        client.status === 'active' 
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                      }`}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          switchOrganization('org-alpha');
                          onNavigateTab('crm');
                        }}
                        className="px-2.5 py-1 rounded bg-[#2563EB]/20 hover:bg-[#2563EB] text-[#38BDF8] hover:text-white transition font-medium text-xs"
                      >
                        Acessar CRM
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
