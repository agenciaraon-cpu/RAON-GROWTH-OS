import React, { useState } from 'react';
import { 
  Workflow, Plus, Play, Pause, ChevronRight, 
  ArrowDown, Sparkles, MessageSquare, CheckSquare, 
  Clock, GitBranch, Webhook, Bot, ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Automation } from '../../types';

export const AutomationsModule: React.FC = () => {
  const { automations, toggleAutomation, addAutomation } = useData();
  const { currentOrg } = useAuth();
  const [selectedAuto, setSelectedAuto] = useState<Automation>(automations[0] || null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const [newAutoName, setNewAutoName] = useState('');
  const [newAutoTrigger, setNewAutoTrigger] = useState<'lead.created' | 'deal.won' | 'task.overdue' | 'form.submitted'>('lead.created');

  const handleCreateAuto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAutoName.trim()) return;

    const created = addAutomation({
      organizationId: currentOrg.id,
      name: newAutoName,
      trigger: newAutoTrigger,
      active: true,
      executionCount: 0,
      stepsCount: 3,
      description: `Disparo configurado no evento "${newAutoTrigger}".`,
      steps: [
        { id: 's1', type: 'action', title: 'Atribuir Vendedor Responsável', details: 'Rotação automática na equipe' },
        { id: 's2', type: 'action', title: 'Criar Tarefa de Primeiro Contato', details: 'Prazo: 15 minutos' },
        { id: 's3', type: 'action', title: 'Disparo de WhatsApp Oficial', details: 'Template de boas-vindas' },
      ],
    });

    setSelectedAuto(created);
    setNewAutoName('');
    setIsBuilderOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF7A18] bg-[#FF7A18]/10 px-2 py-0.5 rounded border border-[#FF7A18]/20">
              INFRAESTRUTURA & FLUXOS
            </span>
            <span className="text-xs text-[#94A3B8]">AUTOMATION BUILDER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Automações Comerciais & Gatilhos
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Automatize distribuição de leads, sequências de WhatsApp, alertas de follow-up e tarefas de vendas.
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Automação</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Automations List (5 cols) */}
        <div className="lg:col-span-5 bg-[#101522] border border-[#151C2C] rounded-2xl p-4 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white px-2">Fluxos Configurados</h2>
          <div className="space-y-2">
            {automations.map(auto => {
              const isSelected = selectedAuto?.id === auto.id;
              return (
                <div
                  key={auto.id}
                  onClick={() => setSelectedAuto(auto)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected 
                      ? 'bg-[#151C2C] border-[#38BDF8] shadow-md' 
                      : 'bg-[#080B14] border-[#151C2C] hover:border-[#38BDF8]/40'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#38BDF8] font-bold">
                        {auto.trigger}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${auto.active ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
                        {auto.active ? 'Ativa' : 'Pausada'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs text-white mt-1">
                      {auto.name}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-2">
                      {auto.description}
                    </p>
                    <span className="text-[10px] text-[#94A3B8] font-mono mt-1.5 block">
                      Execuções: {auto.executionCount} vezes
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAutomation(auto.id);
                    }}
                    className={`p-2 rounded-lg transition ${
                      auto.active ? 'text-[#22C55E] hover:bg-[#22C55E]/10' : 'text-[#94A3B8] hover:bg-[#151C2C]'
                    }`}
                    title={auto.active ? 'Pausar Automação' : 'Ativar Automação'}
                  >
                    {auto.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Step Flow Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-[#101522] border border-[#151C2C] rounded-2xl p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#151C2C]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-bold">
                VISUAL WORKFLOW INSPECTOR
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {selectedAuto?.name || 'Selecione uma automação'}
              </h2>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
              selectedAuto?.active ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#94A3B8]/20 text-[#94A3B8]'
            }`}>
              {selectedAuto?.active ? 'Em Execução' : 'Pausada'}
            </span>
          </div>

          {/* Flow steps diagram */}
          <div className="space-y-4 max-w-md mx-auto py-2">
            {/* TRIGGER BOX */}
            <div className="p-4 rounded-xl bg-linear-to-r from-[#FF7A18]/20 to-[#FF9F43]/10 border border-[#FF7A18]/40 shadow-sm text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF9F43] block">
                GATILHO DO SISTEMA
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Evento: {selectedAuto?.trigger}
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Dispara instantaneamente quando o evento ocorre no banco de dados.
              </p>
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* ACTION 1 */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#2563EB]/40 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase block">AÇÃO 1</span>
                <h4 className="font-bold text-xs text-white">Atribuir Vendedor via Round-Robin</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Distribui lead de forma justa entre vendedores ativos.</p>
              </div>
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* ACTION 2 */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#22C55E]/40 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#22C55E] font-bold uppercase block">AÇÃO 2</span>
                <h4 className="font-bold text-xs text-white">Disparar WhatsApp Business API Oficial</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Mensagem com personalização de primeiro nome e serviço de interesse.</p>
              </div>
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* WAIT & CONDITION */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#FF9F43]/40 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF9F43]/20 text-[#FF9F43] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#FF9F43] font-bold uppercase block">CONDIÇÃO / ESPERA</span>
                <h4 className="font-bold text-xs text-white">Aguardar 24h & Checar Interação</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Se lead não respondeu, alertar SDR para ligação telefônica ativa.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Automation Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Nova Automação de Fluxo</h2>
            <form onSubmit={handleCreateAuto} className="space-y-3">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Nome do Fluxo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cadência de Reativação 30 Dias"
                  value={newAutoName}
                  onChange={e => setNewAutoName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Gatilho (Evento Inicial)</label>
                <select
                  value={newAutoTrigger}
                  onChange={e => setNewAutoTrigger(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                >
                  <option value="lead.created">lead.created (Novo lead captado)</option>
                  <option value="deal.won">deal.won (Venda fechada)</option>
                  <option value="task.overdue">task.overdue (Tarefa atrasada)</option>
                  <option value="form.submitted">form.submitted (Formulário submetido)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#151C2C] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#151C2C] text-[#94A3B8] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white font-semibold"
                >
                  Ativar Automação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
