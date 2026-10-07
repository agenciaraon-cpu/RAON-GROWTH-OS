import React, { useState } from 'react';
import { 
  X, Phone, MessageSquare, Mail, Building, MapPin, 
  Calendar, Clock, DollarSign, UserCheck, Plus, CheckCircle2,
  FileText, Activity as ActivityIcon, Send, ExternalLink, ArrowRight
} from 'lucide-react';
import { Lead, Activity, Task, LeadStage } from '../../types';
import { useData } from '../../context/DataContext';

interface LeadProfileDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onOpenEdit?: (lead: Lead) => void;
}

export const LeadProfileDrawer: React.FC<LeadProfileDrawerProps> = ({ 
  lead, 
  onClose,
  onOpenEdit
}) => {
  const { activities, addActivity, tasks, addTask, changeLeadStage } = useData();
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'notes'>('timeline');

  if (!lead) return null;

  const leadActivities = activities.filter(a => a.leadId === lead.id);
  const leadTasks = tasks.filter(t => t.leadId === lead.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addActivity({
      organizationId: lead.organizationId,
      leadId: lead.id,
      type: 'note',
      description: newNote,
      userName: 'Usuário Atual',
    });
    setNewNote('');
  };

  const handleRegisterContact = (type: Activity['type'], description: string) => {
    addActivity({
      organizationId: lead.organizationId,
      leadId: lead.id,
      type,
      description,
      userName: 'Usuário Atual',
    });
  };

  const cleanPhone = lead.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)}%2C%20tudo%20bem%3F%20Aqui%20%C3%A9%20da%20equipe%20comercial.`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#101522] border-l border-[#151C2C] h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#151C2C] bg-[#080B14] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF7A18] bg-[#FF7A18]/15 px-2 py-0.5 rounded border border-[#FF7A18]/30">
                PERFIL DO LEAD
              </span>
              <span className="text-xs text-[#94A3B8]">Origem: {lead.origin}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {lead.name}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              {lead.company ? `${lead.company} • ` : ''}{lead.city || 'São Paulo'}/{lead.state || 'SP'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEdit && (
              <button
                onClick={() => onOpenEdit(lead)}
                className="px-2.5 py-1 rounded-lg bg-[#151C2C] hover:bg-[#2563EB] text-xs text-white transition"
              >
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stage Bar */}
        <div className="p-3 bg-[#151C2C]/50 border-b border-[#151C2C] flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] text-[#94A3B8] uppercase font-mono shrink-0">Estágio:</span>
          {(['novo_lead', 'contato', 'qualificado', 'orcamento', 'negociacao', 'ganho', 'perdido'] as LeadStage[]).map(stg => (
            <button
              key={stg}
              onClick={() => changeLeadStage(lead.id, stg)}
              className={`px-2 py-1 rounded text-[11px] font-medium shrink-0 transition ${
                lead.stage === stg
                  ? 'bg-[#FF7A18] text-white font-bold shadow-xs'
                  : 'bg-[#080B14] text-[#94A3B8] hover:text-white border border-[#151C2C]'
              }`}
            >
              {stg === 'novo_lead' ? 'Novo' :
               stg === 'contato' ? 'Contato' :
               stg === 'qualificado' ? 'Qualificado' :
               stg === 'orcamento' ? 'Orçamento' :
               stg === 'negociacao' ? 'Negociação' :
               stg === 'ganho' ? 'Ganho' : 'Perdido'}
            </button>
          ))}
        </div>

        {/* Action Bar (WhatsApp, Call, Email) */}
        <div className="p-3.5 bg-[#080B14]/80 border-b border-[#151C2C] flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleRegisterContact('whatsapp', `Mensagem de WhatsApp iniciada para ${lead.whatsapp}.`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#22C55E] hover:bg-[#22C55E]/90 text-white font-semibold text-xs transition shadow-md shadow-[#22C55E]/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Abrir WhatsApp</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          <button
            onClick={() => handleRegisterContact('call', `Ligação efetuada para ${lead.phone}.`)}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#151C2C] hover:bg-[#2563EB] text-white font-medium text-xs transition border border-[#151C2C]"
          >
            <Phone className="w-4 h-4 text-[#38BDF8]" />
            <span>Registrar Ligação</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Informações detalhadas */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-2.5">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Dados do Contato
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[#94A3B8] block text-[10px]">WhatsApp:</span>
                <span className="font-mono text-white">{lead.whatsapp}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">E-mail:</span>
                <span className="text-white truncate block">{lead.email}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Valor Potencial:</span>
                <span className="font-mono font-bold text-[#22C55E]">
                  R$ {lead.potentialValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Responsável:</span>
                <span className="text-white">{lead.responsible}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Campanha:</span>
                <span className="text-white">{lead.campaignName || 'Tráfego Pago'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Próxima Ação:</span>
                <span className="text-[#FF9F43]">{lead.nextAction || 'Follow-up de qualificação'}</span>
              </div>
            </div>
          </div>

          {/* Tabs: Timeline vs Tarefas */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-[#151C2C] pb-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`font-semibold text-xs transition ${
                  activeTab === 'timeline' ? 'text-[#38BDF8] border-b-2 border-[#38BDF8] pb-1' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Linha do Tempo ({leadActivities.length})
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`font-semibold text-xs transition ${
                  activeTab === 'tasks' ? 'text-[#38BDF8] border-b-2 border-[#38BDF8] pb-1' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Tarefas ({leadTasks.length})
              </button>
            </div>

            {/* TAB: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-3">
                {/* Add note input */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar nota rápida de conversa ou reunião..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                </form>

                {/* Timeline items */}
                <div className="space-y-2 pt-2">
                  {leadActivities.length === 0 ? (
                    <div className="text-center py-6 text-[#94A3B8] text-xs">
                      Nenhuma atividade registrada ainda.
                    </div>
                  ) : (
                    leadActivities.map(act => (
                      <div key={act.id} className="p-3 rounded-lg bg-[#080B14] border border-[#151C2C] flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                          <ActivityIcon className="w-3 h-3" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white capitalize">
                              {act.type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">{act.createdAt}</span>
                          </div>
                          <p className="text-[#94A3B8] text-xs mt-0.5">{act.description}</p>
                          <span className="text-[10px] text-[#38BDF8] mt-1 block">Por: {act.userName}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: TASKS */}
            {activeTab === 'tasks' && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    addTask({
                      organizationId: lead.organizationId,
                      leadId: lead.id,
                      title: `Follow-up com ${lead.name}`,
                      responsible: lead.responsible,
                      dueDate: 'Amanhã às 10:00',
                      priority: 'high',
                      status: 'pending',
                    });
                  }}
                  className="w-full py-2 rounded-lg border border-dashed border-[#38BDF8]/40 hover:border-[#38BDF8] text-xs font-semibold text-[#38BDF8] transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Nova Tarefa para Este Lead</span>
                </button>

                <div className="space-y-2">
                  {leadTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{t.title}</div>
                        <div className="text-[10px] text-[#94A3B8]">Prazo: {t.dueDate} • {t.responsible}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        t.status === 'completed' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#FF7A18]/20 text-[#FF9F43]'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
