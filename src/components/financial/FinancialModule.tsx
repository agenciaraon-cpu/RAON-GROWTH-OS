import React from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Layers, Users, PieChart
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const FinancialModule: React.FC = () => {
  const { clients, deals } = useData();
  const { currentOrg } = useAuth();

  const mrr = currentOrg.mrr || 184500;
  const arr = mrr * 12;
  const avgTicket = 35000;
  const cac = 850;
  const ltv = 420000;
  const churnRate = 1.8;
  const delinquency = 2.4; // % inadimplência

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
              MÉTRICAS SAAS & FATURAMENTO
            </span>
            <span className="text-xs text-[#94A3B8]">{currentOrg.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Painel Financeiro & Unit Economics
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Acompanhe receita recorrente, eficiência de capital, LTV/CAC e inadimplência.
          </p>
        </div>
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">MRR (Mensal)</span>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            R$ {mrr.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#22C55E] flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
          </span>
        </div>

        {/* ARR */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">ARR (Anualizado)</span>
          <div className="text-2xl font-bold text-[#38BDF8] mt-1 font-mono">
            R$ {(arr / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] text-[#94A3B8]">Receita Anual Projetada</span>
        </div>

        {/* LTV / CAC */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Relação LTV / CAC</span>
          <div className="text-2xl font-bold text-[#22C55E] mt-1 font-mono">
            {(ltv / cac).toFixed(0)}x
          </div>
          <span className="text-[10px] text-[#22C55E]">Excelente (Saudável &gt; 3x)</span>
        </div>

        {/* Inadimplência */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Inadimplência</span>
          <div className="text-2xl font-bold text-[#FF9F43] mt-1 font-mono">
            {delinquency}%
          </div>
          <span className="text-[10px] text-[#22C55E]">Controlada via Asaas Pix</span>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] space-y-4">
          <h2 className="text-sm font-bold text-white">Demonstrativo de Receitas & Planos</h2>
          <div className="space-y-3 text-xs">
            {clients.map(c => (
              <div key={c.id} className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-[10px] text-[#94A3B8]">{c.plan} • {c.segment}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#22C55E] block">
                    R$ {c.monthlyTarget > 0 ? (c.monthlyTarget * 0.05).toLocaleString('pt-BR') : '8.900'} /mês
                  </span>
                  <span className="text-[10px] text-[#38BDF8]">Adimplente</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Unit Economics & Churn</h2>
            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B14]">
                <span className="text-[#94A3B8]">Ticket Médio de Venda:</span>
                <span className="font-mono font-bold text-white">R$ {avgTicket.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B14]">
                <span className="text-[#94A3B8]">CAC Médio (Custo Aquisição):</span>
                <span className="font-mono font-bold text-white">R$ {cac.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B14]">
                <span className="text-[#94A3B8]">LTV Médio (Lifetime Value):</span>
                <span className="font-mono font-bold text-[#22C55E]">R$ {ltv.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B14]">
                <span className="text-[#94A3B8]">Churn Rate Mensal:</span>
                <span className="font-mono font-bold text-[#22C55E]">{churnRate}%</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 text-xs text-[#38BDF8]">
            Integração financeira conectada com <b>Asaas</b> e <b>Stripe</b> para conciliação bancária automática de notas e boletos.
          </div>
        </div>
      </div>
    </div>
  );
};
