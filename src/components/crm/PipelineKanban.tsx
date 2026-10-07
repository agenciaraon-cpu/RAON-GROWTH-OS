import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, DollarSign, Clock, User, 
  ArrowRight, CheckCircle2, ChevronRight, Filter, 
  MessageSquare, Sparkles, Layers
} from 'lucide-react';
import { Lead, LeadStage } from '../../types';
import { useData } from '../../context/DataContext';

interface PipelineKanbanProps {
  onSelectLead: (lead: Lead) => void;
  onOpenNewLead: () => void;
}

interface ColumnConfig {
  id: LeadStage;
  title: string;
  color: string;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'novo_lead', title: 'NOVO LEAD', color: '#2563EB' },
  { id: 'contato', title: 'CONTATO', color: '#38BDF8' },
  { id: 'qualificado', title: 'QUALIFICADO', color: '#FF9F43' },
  { id: 'orcamento', title: 'ORÇAMENTO', color: '#FF7A18' },
  { id: 'negociacao', title: 'NEGOCIAÇÃO', color: '#F59E0B' },
  { id: 'ganho', title: 'GANHO', color: '#22C55E' },
  { id: 'perdido', title: 'PERDIDO', color: '#EF4444' },
];

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({ 
  onSelectLead, 
  onOpenNewLead 
}) => {
  const { leads, changeLeadStage } = useData();
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [filterResponsible, setFilterResponsible] = useState<string>('all');

  const filteredLeads = leads.filter(l => {
    return filterResponsible === 'all' || l.responsible.includes(filterResponsible);
  });

  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: LeadStage) => {
    if (draggedLeadId) {
      changeLeadStage(draggedLeadId, stage);
      setDraggedLeadId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kanban Sub-Header with Total pipeline value and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101522] p-3 rounded-xl border border-[#151C2C]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Layers className="w-4 h-4 text-[#FF7A18]" />
            <span>Pipeline Kanban</span>
          </div>
          <span className="text-xs text-[#94A3B8]">
            Total no Funil: <b className="text-[#22C55E] font-mono">
              R$ {leads.reduce((s, l) => s + l.potentialValue, 0).toLocaleString('pt-BR')}
            </b>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Vendedor:
          </span>
          <select
            value={filterResponsible}
            onChange={e => setFilterResponsible(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden"
          >
            <option value="all">Toda a Equipe RAON</option>
            <option value="Thiago Pinheiro">Thiago Pinheiro (CEO)</option>
            <option value="Mateus Lima">Mateus Lima (Líder de Criativos)</option>
            <option value="Gabriela Alencar">Gabriela Alencar (Administradora)</option>
          </select>

          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF7A18] hover:bg-[#FF9F43] text-white text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Card</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container (Horizontally Scrollable) */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-start min-h-[600px]">
        {DEFAULT_COLUMNS.map(col => {
          const colLeads = filteredLeads.filter(l => l.stage === col.id);
          const colValue = colLeads.reduce((acc, l) => acc + l.potentialValue, 0);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="w-72 shrink-0 bg-[#101522] border border-[#151C2C] rounded-xl flex flex-col max-h-[750px] shadow-md"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-[#151C2C] flex items-center justify-between bg-[#080B14]/60 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="font-bold text-xs text-white tracking-wide">
                    {col.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-[#151C2C] text-[#94A3B8] font-bold">
                    {colLeads.length}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-[#94A3B8] font-semibold">
                  R$ {(colValue / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Cards List */}
              <div className="p-2 space-y-2 overflow-y-auto flex-1 min-h-[150px]">
                {colLeads.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-[#94A3B8] border border-dashed border-[#151C2C] rounded-lg">
                    Arraste leads para cá
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      onClick={() => onSelectLead(lead)}
                      className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C] hover:border-[#38BDF8]/50 hover:bg-[#151C2C]/30 transition cursor-grab active:cursor-grabbing shadow-xs group space-y-2"
                    >
                      {/* Card Top: Name & Origin */}
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="truncate">
                          <h4 className="font-bold text-xs text-white group-hover:text-[#38BDF8] transition truncate">
                            {lead.name}
                          </h4>
                          <span className="text-[10px] text-[#94A3B8] truncate block">
                            {lead.company || lead.city || 'Sem empresa'}
                          </span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-[#151C2C] text-[#94A3B8] shrink-0">
                          {lead.origin}
                        </span>
                      </div>

                      {/* Value & Responsible */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#151C2C]/50">
                        <span className="font-mono font-bold text-[#22C55E]">
                          R$ {lead.potentialValue.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] truncate max-w-[110px]">
                          {lead.responsible.split(' ')[0]}
                        </span>
                      </div>

                      {/* Next Action / Task */}
                      {lead.nextAction && (
                        <div className="text-[10px] text-[#FF9F43] bg-[#FF7A18]/10 px-2 py-1 rounded truncate flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{lead.nextAction}</span>
                        </div>
                      )}

                      {/* Fast Advance button */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-[#94A3B8]">
                        <span>Clique p/ abrir</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Move to next stage in sequence
                            const currentIndex = DEFAULT_COLUMNS.findIndex(c => c.id === col.id);
                            if (currentIndex < DEFAULT_COLUMNS.length - 1) {
                              changeLeadStage(lead.id, DEFAULT_COLUMNS[currentIndex + 1].id);
                            }
                          }}
                          className="text-[#38BDF8] hover:underline flex items-center gap-0.5 font-medium"
                        >
                          <span>Avançar</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
