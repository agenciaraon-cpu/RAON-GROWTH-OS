import React, { useState, useEffect } from 'react';
import { 
  Search, X, Building2, Flame, Megaphone, 
  CheckSquare, ChevronRight, User, DollarSign
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Lead, Client, Task, Campaign } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, item: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectResult
}) => {
  const { leads, clients, tasks, campaigns } = useData();
  const [query, setQuery] = useState('');

  // Handle ESC key and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingClients = q ? clients.filter(c => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)) : [];
  const matchingLeads = q ? leads.filter(l => l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.company && l.company.toLowerCase().includes(q))) : [];
  const matchingTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q)) : [];
  const matchingCampaigns = q ? campaigns.filter(c => c.name.toLowerCase().includes(q) || c.channel.toLowerCase().includes(q)) : [];

  const hasResults = matchingClients.length > 0 || matchingLeads.length > 0 || matchingTasks.length > 0 || matchingCampaigns.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#151C2C] flex items-center gap-3 bg-[#080B14]">
          <Search className="w-5 h-5 text-[#38BDF8]" />
          <input
            type="text"
            autoFocus
            placeholder="Pesquise leads, clientes, campanhas, tarefas... (ESC para fechar)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#94A3B8] outline-hidden"
          />
          <button onClick={onClose} className="p-1 rounded text-[#94A3B8] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {!query && (
            <div className="text-center py-8 text-[#94A3B8]">
              Digite o nome de um lead, empresa cliente, campanha ou tarefa para pesquisar.
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-8 text-[#94A3B8]">
              Nenhum resultado encontrado para "{query}".
            </div>
          )}

          {/* Clientes */}
          {matchingClients.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#38BDF8] block mb-1">
                Clientes ({matchingClients.length})
              </span>
              <div className="space-y-1">
                {matchingClients.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectResult('client', c);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-[#080B14] hover:bg-[#151C2C] border border-[#151C2C] flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#FF7A18]" />
                      <div>
                        <span className="font-semibold text-white">{c.name}</span>
                        <span className="text-[10px] text-[#94A3B8] block">{c.segment} • {c.city}/{c.state}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchingLeads.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#22C55E] block mb-1">
                Leads no CRM ({matchingLeads.length})
              </span>
              <div className="space-y-1">
                {matchingLeads.slice(0, 5).map(l => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectResult('lead', l);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-[#080B14] hover:bg-[#151C2C] border border-[#151C2C] flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#38BDF8]" />
                      <div>
                        <span className="font-semibold text-white">{l.name}</span>
                        <span className="text-[10px] text-[#94A3B8] block">{l.whatsapp} • {l.origin} • R$ {l.potentialValue.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#FF9F43]">{l.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campanhas */}
          {matchingCampaigns.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#FF9F43] block mb-1">
                Campanhas ({matchingCampaigns.length})
              </span>
              <div className="space-y-1">
                {matchingCampaigns.map(cp => (
                  <div
                    key={cp.id}
                    onClick={() => {
                      onSelectResult('campaign', cp);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-[#080B14] hover:bg-[#151C2C] border border-[#151C2C] flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#FF7A18]" />
                      <span className="font-semibold text-white">{cp.name}</span>
                    </div>
                    <span className="text-[10px] text-[#38BDF8]">{cp.channel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
