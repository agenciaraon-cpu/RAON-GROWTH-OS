import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Filter, MoreVertical, 
  ExternalLink, Edit, Trash2, CheckCircle2, AlertTriangle, 
  ChevronRight, ArrowUpRight, TrendingUp, DollarSign, Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Client } from '../../types';
import { ClientModal } from './ClientModal';

interface ClientsModuleProps {
  onNavigateTab: (tab: any) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({ onNavigateTab }) => {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const { switchOrganization } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
      (c.cnpj && c.cnpj.includes(search)) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || c.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  });

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Client, 'id' | 'createdAt'>) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
    } else {
      addClient(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#101522] border border-[#151C2C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF7A18] bg-[#FF7A18]/10 px-2 py-0.5 rounded border border-[#FF7A18]/20">
              MÓDULO DE CLIENTES & PORTFÓLIO
            </span>
            <span className="text-xs text-[#94A3B8]">RAON Matriz</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Gestão de Contas & Empresas Clientes
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Cadastre, acompanhe metas, monitore health score e configure a infraestrutura comercial de cada parceiro.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Cliente (Onboarding)</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101522] p-3 rounded-xl border border-[#151C2C]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou CNPJ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#94A3B8] flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Segmento:
          </span>
          {['all', 'Imobiliária', 'Clínica', 'Advocacia', 'Varejo', 'Serviços'].map(seg => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                selectedSegment === seg
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#080B14] text-[#94A3B8] hover:text-white border border-[#151C2C]'
              }`}
            >
              {seg === 'all' ? 'Todos' : seg}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div 
            key={client.id}
            className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition shadow-lg flex flex-col justify-between group"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#151C2C]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2563EB]/15 text-[#38BDF8] font-bold">
                      {client.segment}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                      client.status === 'active' 
                        ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-[#38BDF8] transition">
                    {client.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    {client.city}/{client.state} {client.cnpj ? `• ${client.cnpj}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
                    title="Editar Cliente"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
                        deleteClient(client.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#151C2C] transition"
                    title="Excluir Cliente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metrics & Info */}
              <div className="py-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Plano Contratado:</span>
                  <span className="font-semibold text-white">{client.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Responsável RAON:</span>
                  <span className="text-white">{client.raonResponsible}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Meta Mensal:</span>
                  <span className="font-mono font-bold text-[#22C55E]">
                    R$ {client.monthlyTarget.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Ticket Médio:</span>
                  <span className="font-mono text-white">
                    R$ {client.averageTicket.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Health Score & Churn Risk */}
                <div className="pt-2 border-t border-[#151C2C] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Health Score:</span>
                    <span className={`text-xs font-mono font-bold ${
                      client.healthScore >= 70 ? 'text-[#22C55E]' : client.healthScore >= 40 ? 'text-[#FF9F43]' : 'text-[#EF4444]'
                    }`}>
                      {client.healthScore}/100
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#94A3B8] block">Risco Churn:</span>
                    <span className={`text-xs font-mono font-bold ${
                      client.churnRisk > 40 ? 'text-[#EF4444]' : 'text-[#22C55E]'
                    }`}>
                      {client.churnRisk}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-3 border-t border-[#151C2C] flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#94A3B8]">
                Entrada: {new Date(client.startDate).toLocaleDateString('pt-BR')}
              </span>
              <button
                onClick={() => {
                  switchOrganization(client.id === 'client-1' ? 'org-alpha' : client.id === 'client-2' ? 'org-lumina' : 'org-vanguard');
                  onNavigateTab('crm');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
              >
                <span>Acessar CRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingClient}
      />
    </div>
  );
};
