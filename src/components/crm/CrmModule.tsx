import React, { useState } from 'react';
import { 
  Flame, Users, DollarSign, Activity as ActivityIcon, 
  Search, Filter, Plus, Phone, MessageSquare, Download, 
  ChevronRight, ArrowUpDown, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Lead, LeadStage, Deal } from '../../types';
import { PipelineKanban } from './PipelineKanban';
import { LeadProfileDrawer } from './LeadProfileDrawer';
import { LeadModal } from './LeadModal';

export const CrmModule: React.FC = () => {
  const { leads, deals, activities, addLead, updateLead, deleteLead, setDealStatus } = useData();

  const [crmTab, setCrmTab] = useState<'pipeline' | 'leads' | 'deals' | 'activities'>('pipeline');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.phone.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleOpenEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleOpenCreateLead = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (data: Omit<Lead, 'id' | 'createdAt'>) => {
    if (editingLead) {
      updateLead(editingLead.id, data);
    } else {
      addLead(data);
    }
  };

  // Export leads to CSV
  const handleExportCSV = () => {
    const headers = ['Nome', 'WhatsApp', 'Email', 'Empresa', 'Origem', 'Estagio', 'Valor', 'Responsavel'];
    const rows = filteredLeads.map(l => [
      `"${l.name}"`,
      `"${l.whatsapp}"`,
      `"${l.email}"`,
      `"${l.company || ''}"`,
      `"${l.origin}"`,
      `"${l.stage}"`,
      l.potentialValue,
      `"${l.responsible}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_raon_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* CRM Navigation Tabs & Quick Stats Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF7A18] bg-[#FF7A18]/10 px-2 py-0.5 rounded border border-[#FF7A18]/20">
              CRM OPERACIONAL
            </span>
            <span className="text-xs text-[#94A3B8]">MÉTODO RAON 360°</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Gestão Comercial & Pipeline de Vendas
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tabs pills */}
          <div className="flex items-center bg-[#080B14] p-1 rounded-xl border border-[#151C2C] text-xs">
            <button
              onClick={() => setCrmTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                crmTab === 'pipeline' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Pipeline (Kanban)
            </button>
            <button
              onClick={() => setCrmTab('leads')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                crmTab === 'leads' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Leads ({leads.length})
            </button>
            <button
              onClick={() => setCrmTab('deals')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                crmTab === 'deals' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Oportunidades ({deals.length})
            </button>
            <button
              onClick={() => setCrmTab('activities')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                crmTab === 'activities' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>

          <button
            onClick={handleOpenCreateLead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-[#FF7A18]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Lead</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {crmTab === 'pipeline' && (
        <PipelineKanban
          onSelectLead={setSelectedLead}
          onOpenNewLead={handleOpenCreateLead}
        />
      )}

      {/* VIEW 2: LEADS TABLE */}
      {crmTab === 'leads' && (
        <div className="bg-[#101522] border border-[#151C2C] rounded-2xl overflow-hidden shadow-lg space-y-4 p-5">
          {/* Table filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar lead por nome, telefone ou empresa..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden"
              >
                <option value="all">Todos os Estágios</option>
                <option value="novo_lead">Novo Lead</option>
                <option value="contato">Contato</option>
                <option value="qualificado">Qualificado</option>
                <option value="orcamento">Orçamento</option>
                <option value="negociacao">Negociação</option>
                <option value="ganho">Ganho</option>
                <option value="perdido">Perdido</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080B14] hover:bg-[#151C2C] border border-[#151C2C] text-xs text-[#94A3B8] hover:text-white transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#151C2C]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
                <tr>
                  <th className="py-3 px-4">Lead / Contato</th>
                  <th className="py-3 px-4">Origem</th>
                  <th className="py-3 px-4">Estágio</th>
                  <th className="py-3 px-4">Valor Potencial</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4">Próxima Ação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151C2C]">
                {filteredLeads.map(lead => (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-[#151C2C]/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-[#38BDF8] transition">
                        {lead.name}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        {lead.whatsapp} • {lead.company || lead.city || 'Sem empresa'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#080B14] border border-[#151C2C] text-[#94A3B8]">
                        {lead.origin}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lead.stage === 'ganho' ? 'bg-[#22C55E]/15 text-[#22C55E]' :
                        lead.stage === 'perdido' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                        'bg-[#2563EB]/15 text-[#38BDF8]'
                      }`}>
                        {lead.stage.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#22C55E]">
                      R$ {lead.potentialValue.toLocaleString('pt-BR')}
                    </td>

                    <td className="py-3.5 px-4 text-white">
                      {lead.responsible}
                    </td>

                    <td className="py-3.5 px-4 text-[#FF9F43] truncate max-w-xs">
                      {lead.nextAction || 'Sem follow-up agendado'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="px-2.5 py-1 rounded bg-[#2563EB]/20 hover:bg-[#2563EB] text-[#38BDF8] hover:text-white transition font-medium text-xs"
                      >
                        Ver Perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: DEALS / OPORTUNIDADES */}
      {crmTab === 'deals' && (
        <div className="bg-[#101522] border border-[#151C2C] rounded-2xl overflow-hidden shadow-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Oportunidades em Aberto & Negociações
            </h2>
            <span className="text-xs text-[#94A3B8]">
              Volume total: <b className="text-[#22C55E] font-mono">
                R$ {deals.reduce((s, d) => s + d.value, 0).toLocaleString('pt-BR')}
              </b>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#151C2C]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
                <tr>
                  <th className="py-3 px-4">Oportunidade / Título</th>
                  <th className="py-3 px-4">Lead Vinculado</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Estágio</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Decisão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151C2C]">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-[#151C2C]/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {deal.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#38BDF8]">
                      {deal.leadName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#22C55E]">
                      R$ {deal.value.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-[#FF9F43]">
                      {deal.stage}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        deal.status === 'won' ? 'bg-[#22C55E]/15 text-[#22C55E]' :
                        deal.status === 'lost' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                        'bg-[#2563EB]/15 text-[#38BDF8]'
                      }`}>
                        {deal.status === 'won' ? 'Ganho' : deal.status === 'lost' ? 'Perdido' : 'Em Aberto'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {deal.status === 'open' && (
                        <>
                          <button
                            onClick={() => setDealStatus(deal.id, 'won')}
                            className="px-2 py-1 rounded bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition font-medium"
                          >
                            Ganhar
                          </button>
                          <button
                            onClick={() => setDealStatus(deal.id, 'lost', 'Desistência do cliente')}
                            className="px-2 py-1 rounded bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition font-medium"
                          >
                            Perder
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: TIMELINE / ATIVIDADES */}
      {crmTab === 'activities' && (
        <div className="bg-[#101522] border border-[#151C2C] rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-[#38BDF8]" />
            Timeline de Atividades Comerciais
          </h2>
          <div className="space-y-3">
            {activities.map(act => (
              <div key={act.id} className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                  <ActivityIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs capitalize">
                      {act.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">{act.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">{act.description}</p>
                  <span className="text-[10px] text-[#38BDF8] mt-1 block">Operador: {act.userName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Profile Drawer */}
      <LeadProfileDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onOpenEdit={handleOpenEditLead}
      />

      {/* Lead Create / Edit Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />
    </div>
  );
};
