import React, { useState } from 'react';
import { 
  Megaphone, Plus, Search, Filter, TrendingUp, 
  DollarSign, ArrowUpRight, BarChart3, ExternalLink, Play, Pause
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Campaign, CampaignChannel } from '../../types';

export const CampaignsModule: React.FC = () => {
  const { campaigns, addCampaign, updateCampaign } = useData();
  const { currentOrg } = useAuth();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCamp, setNewCamp] = useState({
    name: '',
    channel: 'Meta Ads' as CampaignChannel,
    objective: 'Cadastros Qualificados',
    budget: 10000,
    spent: 0,
    leads: 0,
    sales: 0,
    revenue: 0,
    status: 'active' as Campaign['status'],
    startDate: new Date().toISOString().split('T')[0],
    landingPage: 'https://raon.pages.app/campanha',
    utmSource: 'meta_feed',
  });

  const filteredCampaigns = campaigns.filter(c => {
    return channelFilter === 'all' || c.channel === channelFilter;
  });

  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const avgRoas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(1) : '0';

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.name.trim()) return;

    addCampaign({
      ...newCamp,
      organizationId: currentOrg.id,
    });
    setIsModalOpen(false);
  };

  const toggleCampaignStatus = (campaign: Campaign) => {
    const nextStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaign(campaign.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              MÉTODO RAON 360° — ESTRATÉGIA & TRÁFEGO
            </span>
            <span className="text-xs text-[#94A3B8]">RAON CAMPAIGNS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Gestão de Campanhas & Aquisição
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Acompanhe investimento, CPL, vendas originadas e retorno financeiro por anúncio e canal.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Campanha</span>
        </button>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Total Investido</span>
          <div className="text-xl font-bold text-white mt-1">R$ {totalSpent.toLocaleString('pt-BR')}</div>
          <span className="text-[10px] text-[#38BDF8] font-mono">Verba de Tráfego</span>
        </div>
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Leads Gerados</span>
          <div className="text-xl font-bold text-white mt-1">{totalLeads}</div>
          <span className="text-[10px] text-[#22C55E] font-mono">CPL R$ {(totalSpent / (totalLeads || 1)).toFixed(0)}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Receita Originada</span>
          <div className="text-xl font-bold text-[#22C55E] mt-1">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
          <span className="text-[10px] text-[#22C55E] font-mono">Faturamento do CRM</span>
        </div>
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C]">
          <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">ROAS Médio Consolidado</span>
          <div className="text-xl font-bold text-[#FF9F43] mt-1">{avgRoas}x</div>
          <span className="text-[10px] text-[#38BDF8] font-mono">Eficiência RAON 360°</span>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#101522] border border-[#151C2C] rounded-2xl overflow-hidden shadow-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Campanhas Ativas & Resultados</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Canal:
            </span>
            <select
              value={channelFilter}
              onChange={e => setChannelFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden"
            >
              <option value="all">Todos os Canais</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Google Ads">Google Ads</option>
              <option value="TikTok Ads">TikTok Ads</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#151C2C]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
              <tr>
                <th className="py-3 px-4">Campanha / Canal</th>
                <th className="py-3 px-4">Investido / Budget</th>
                <th className="py-3 px-4">Leads</th>
                <th className="py-3 px-4">CPL</th>
                <th className="py-3 px-4">Vendas</th>
                <th className="py-3 px-4">Receita</th>
                <th className="py-3 px-4">ROAS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151C2C]">
              {filteredCampaigns.map(camp => {
                const cpl = camp.leads > 0 ? (camp.spent / camp.leads).toFixed(0) : '0';
                const roas = camp.spent > 0 ? (camp.revenue / camp.spent).toFixed(1) : '0';

                return (
                  <tr key={camp.id} className="hover:bg-[#151C2C]/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{camp.name}</div>
                      <div className="text-[10px] text-[#38BDF8] flex items-center gap-1">
                        <span>{camp.channel}</span>
                        <span>•</span>
                        <span>{camp.objective}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-white font-semibold">R$ {camp.spent.toLocaleString('pt-BR')}</div>
                      <div className="text-[10px] text-[#94A3B8]">Orç: R$ {camp.budget.toLocaleString('pt-BR')}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {camp.leads}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#38BDF8]">
                      R$ {cpl}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#22C55E]">
                      {camp.sales} vendas
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#22C55E]">
                      R$ {camp.revenue.toLocaleString('pt-BR')}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#FF9F43]">
                      {roas}x
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        camp.status === 'active' ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#94A3B8]/20 text-[#94A3B8]'
                      }`}>
                        {camp.status === 'active' ? 'Ativa' : 'Pausada'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleCampaignStatus(camp)}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          camp.status === 'active' 
                            ? 'text-[#FF9F43] hover:bg-[#FF7A18]/20' 
                            : 'text-[#22C55E] hover:bg-[#22C55E]/20'
                        }`}
                        title={camp.status === 'active' ? 'Pausar Campanha' : 'Ativar Campanha'}
                      >
                        {camp.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Criar Nova Campanha de Tráfego</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Meta Ads — Lançamento Residencial Q4"
                  value={newCamp.name}
                  onChange={e => setNewCamp({ ...newCamp, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Canal</label>
                  <select
                    value={newCamp.channel}
                    onChange={e => setNewCamp({ ...newCamp, channel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  >
                    <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                    <option value="Google Ads">Google Ads (Search & Display)</option>
                    <option value="TikTok Ads">TikTok Ads</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Orgânico">Orgânico</option>
                    <option value="Indicação">Indicação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Objetivo</label>
                  <input
                    type="text"
                    value={newCamp.objective}
                    onChange={e => setNewCamp({ ...newCamp, objective: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Orçamento Previsto (R$)</label>
                  <input
                    type="number"
                    value={newCamp.budget}
                    onChange={e => setNewCamp({ ...newCamp, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Landing Page / URL</label>
                  <input
                    type="text"
                    value={newCamp.landingPage}
                    onChange={e => setNewCamp({ ...newCamp, landingPage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#151C2C] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#151C2C] text-[#94A3B8] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white font-semibold"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
