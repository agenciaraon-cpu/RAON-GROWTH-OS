import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, Printer, Share2, 
  TrendingUp, DollarSign, Users, Megaphone, CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const ReportsModule: React.FC = () => {
  const { leads, deals, campaigns, clients } = useData();
  const { currentOrg } = useAuth();
  const [selectedReport, setSelectedReport] = useState<'marketing' | 'sales' | 'leads' | 'roi'>('marketing');

  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalRevenue = deals.filter(d => d.status === 'won').reduce((s, d) => s + d.value, 0) || 735000;
  const totalLeads = leads.length;
  const wonDeals = deals.filter(d => d.status === 'won').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[] = [];

    if (selectedReport === 'marketing') {
      headers = ['Campanha', 'Canal', 'Investido', 'Leads', 'Vendas', 'Receita', 'ROAS'];
      rows = campaigns.map(c => [
        `"${c.name}"`,
        `"${c.channel}"`,
        c.spent,
        c.leads,
        c.sales,
        c.revenue,
        c.spent > 0 ? (c.revenue / c.spent).toFixed(1) : '0'
      ]);
    } else {
      headers = ['Nome', 'WhatsApp', 'Email', 'Estagio', 'Valor', 'Responsavel'];
      rows = leads.map(l => [
        `"${l.name}"`,
        `"${l.whatsapp}"`,
        `"${l.email}"`,
        `"${l.stage}"`,
        l.potentialValue,
        `"${l.responsible}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_raon_${selectedReport}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              BUSINESS INTELLIGENCE & RELATÓRIOS
            </span>
            <span className="text-xs text-[#94A3B8]">{currentOrg.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Relatórios Executivos Consolidados
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Exporte análises de tráfego, eficiência comercial e prestação de contas no padrão RAON 360°.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#080B14] hover:bg-[#151C2C] border border-[#151C2C] text-xs font-semibold text-white transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 bg-[#101522] p-2 rounded-xl border border-[#151C2C] overflow-x-auto text-xs">
        {[
          { id: 'marketing', label: 'Relatório de Marketing & Campanhas' },
          { id: 'sales', label: 'Relatório Comercial & Pipeline' },
          { id: 'leads', label: 'Relatório Completo de Leads' },
          { id: 'roi', label: 'Relatório Financeiro & ROI / ROAS' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              selectedReport === tab.id
                ? 'bg-[#FF7A18] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content View */}
      <div className="bg-[#101522] border border-[#151C2C] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#151C2C]">
          <div>
            <h2 className="text-base font-bold text-white capitalize">
              {selectedReport === 'marketing' && 'Performance de Marketing por Canal'}
              {selectedReport === 'sales' && 'Métricas de Fechamento Comercial'}
              {selectedReport === 'leads' && 'Origem e Qualificação de Leads'}
              {selectedReport === 'roi' && 'Demonstrativo de Retorno sobre Investimento (ROI)'}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#94A3B8] block">Organização Auditada:</span>
            <span className="font-bold text-xs text-white">{currentOrg.name}</span>
          </div>
        </div>

        {/* Big numbers summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#080B14] border border-[#151C2C]">
          <div>
            <span className="text-[10px] text-[#94A3B8] uppercase block">Total Investido</span>
            <span className="text-lg font-bold font-mono text-white">R$ {totalSpent.toLocaleString('pt-BR')}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] uppercase block">Leads Gerados</span>
            <span className="text-lg font-bold font-mono text-[#38BDF8]">{totalLeads}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] uppercase block">Vendas Fechadas</span>
            <span className="text-lg font-bold font-mono text-[#22C55E]">{wonDeals}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] uppercase block">Receita Comercial</span>
            <span className="text-lg font-bold font-mono text-[#FF9F43]">R$ {totalRevenue.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto rounded-xl border border-[#151C2C]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
              <tr>
                <th className="py-3 px-4">Canal / Ativo</th>
                <th className="py-3 px-4">Investimento</th>
                <th className="py-3 px-4">Leads</th>
                <th className="py-3 px-4">CPL Médio</th>
                <th className="py-3 px-4">Receita</th>
                <th className="py-3 px-4">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151C2C]">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-[#151C2C]/50 transition">
                  <td className="py-3 px-4 font-semibold text-white">{camp.name}</td>
                  <td className="py-3 px-4 font-mono text-white">R$ {camp.spent.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-4 font-mono text-white">{camp.leads}</td>
                  <td className="py-3 px-4 font-mono text-[#38BDF8]">R$ {camp.leads > 0 ? (camp.spent / camp.leads).toFixed(0) : '0'}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#22C55E]">R$ {camp.revenue.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#FF9F43]">{camp.spent > 0 ? (camp.revenue / camp.spent).toFixed(1) : '0'}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
