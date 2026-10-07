import React, { useState } from 'react';
import { 
  X, Check, Building2, ChevronRight, ChevronLeft, 
  Sparkles, Layers, Share2, ShieldCheck, CheckCircle2,
  Workflow
} from 'lucide-react';
import { Client } from '../../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt'>) => void;
  initialData?: Client | null;
}

const SEGMENT_RECOMMENDATIONS: Record<string, {
  funnelStages: string[];
  automations: string[];
  kpis: string[];
  suggestedTicket: number;
}> = {
  'Imobiliária': {
    funnelStages: ['Novo Lead', 'Qualificação BANT', 'Visita Agendada', 'Proposta Imóvel', 'Contrato & Cartório', 'Venda Fechada'],
    automations: ['Alerta de Corretor de Plantão', 'Régua de Lançamento Imobiliário', 'Pesquisa de Perfil de Compra'],
    kpis: ['VGV (Valor Geral de Vendas)', 'Custo por Visita', 'Tempo Médio de Fechamento'],
    suggestedTicket: 45000,
  },
  'Clínica': {
    funnelStages: ['Novo Paciente', 'Contato WhatsApp', 'Consulta / Avaliação', 'Plano de Tratamento', 'Procedimento Fechado'],
    automations: ['Confirmação de Consulta 24h', 'Lembrete de Retorno 6 Meses', 'Orientações Pré-Procedimento'],
    kpis: ['Taxa de Comparecimento', 'LTV por Paciente', 'Recorrência de Procedimentos'],
    suggestedTicket: 4500,
  },
  'Advocacia': {
    funnelStages: ['Lead B2B', 'Triagem Jurídica', 'Reunião de Diagnóstico', 'Parecer & Proposta', 'Honorários Fechados'],
    automations: ['Envio de Procuração Digital', 'Follow-up de Diagnóstico', 'Pesquisa de Satisfação'],
    kpis: ['Valor da Causa / Honorários', 'Taxa de Conversão em Reunião', 'CAC Institucional'],
    suggestedTicket: 22000,
  },
  'Varejo': {
    funnelStages: ['Lead Loja', 'Carrinho / Orçamento', 'Negociação Cupom', 'Pedido Faturado'],
    automations: ['Recuperação de Carrinho 1h', 'Alerta de Promoção VIP', 'Pesquisa Pós-Entrega'],
    kpis: ['Ticket Médio', 'Taxa de Recompra', 'ROAS por Categoria'],
    suggestedTicket: 850,
  },
  'Serviços': {
    funnelStages: ['Lead Comercial', 'Briefing Inicial', 'Apresentação de Escopo', 'Proposta Comercial', 'Contrato Ativo'],
    automations: ['Distribuição Round-Robin', 'Follow-up 48h Sem Resposta', 'Boas-Vindas Operacional'],
    kpis: ['MRR', 'Prazo de Implantação', 'NPS de Entrega'],
    suggestedTicket: 12500,
  },
  'Educação': {
    funnelStages: ['Inscrito Vestibular/Curso', 'Contato Consultor', 'Visita ao Campus', 'Matrícula Realizada'],
    automations: ['Régua de Inscrição até Matrícula', 'Envio de Prova / Desconto', 'Boas-Vindas Acadêmico'],
    kpis: ['Custo por Aluno Matriculado', 'Taxa de Evasão Comercial', 'Conversão por Canal'],
    suggestedTicket: 18000,
  },
  'Restaurante': {
    funnelStages: ['Lead Evento/Reserva', 'Contato Menu', 'Reserva Confirmada', 'Evento Realizado'],
    automations: ['Confirmação de Mesa WhatsApp', 'Pesquisa de Experiência', 'Clube de Benefícios'],
    kpis: ['Gasto Médio por Reserva', 'Taxa de No-Show', 'Ocupação do Salão'],
    suggestedTicket: 2400,
  },
  'Outros': {
    funnelStages: ['Novo Lead', 'Contato', 'Qualificado', 'Orçamento', 'Negociação', 'Ganho'],
    automations: ['Distribuição de Lead', 'Follow-up Automático', 'Pesquisa de Satisfação'],
    kpis: ['Leads', 'Vendas', 'Faturamento', 'Ticket Médio'],
    suggestedTicket: 10000,
  },
};

export const ClientModal: React.FC<ClientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [step, setStep] = useState(1);
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    cnpj: initialData?.cnpj || '',
    segment: (initialData?.segment || 'Imobiliária') as Client['segment'],
    city: initialData?.city || '',
    state: initialData?.state || 'SP',
    website: initialData?.website || '',
    instagram: initialData?.instagram || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    plan: initialData?.plan || 'Growth - R$ 8.900/mês',
    status: (initialData?.status || 'active') as Client['status'],
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    raonResponsible: initialData?.raonResponsible || 'Thiago Pinheiro (CEO)',
    monthlyTarget: initialData?.monthlyTarget || 250000,
    averageTicket: initialData?.averageTicket || 35000,
    healthScore: initialData?.healthScore || 85,
    churnRisk: initialData?.churnRisk || 15,
  });

  if (!isOpen) return null;

  const currentRecommendation = SEGMENT_RECOMMENDATIONS[formData.segment] || SEGMENT_RECOMMENDATIONS['Imobiliária'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      organizationId: 'org-raon',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#151C2C] flex items-center justify-between bg-[#080B14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF7A18]/20 flex items-center justify-center text-[#FF7A18]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Cliente' : 'Onboarding de Novo Cliente — RAON 360°'}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Etapa {step} de 7: {
                  step === 1 ? 'Dados da Empresa' :
                  step === 2 ? 'Segmento de Mercado' :
                  step === 3 ? 'Equipe & Responsável' :
                  step === 4 ? 'Configuração do Funil' :
                  step === 5 ? 'Canais de Captação' :
                  step === 6 ? 'Metas & Objetivos' :
                  'Infraestrutura & Integrações'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#151C2C]">
          <div 
            className="h-full bg-linear-to-r from-[#FF7A18] to-[#2563EB] transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* STEP 1: DADOS DA EMPRESA */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Etapa 1: Dados da Empresa</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alpha Imóveis Prime"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">CNPJ</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={formData.cnpj}
                    onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Cidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Estado (UF)</label>
                  <input
                    type="text"
                    placeholder="SP"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">E-mail Principal *</label>
                  <input
                    type="email"
                    required
                    placeholder="contato@empresa.com.br"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">WhatsApp Comercial</label>
                  <input
                    type="text"
                    placeholder="11987654321"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SEGMENTO & SUGESTÕES AUTOMÁTICAS */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Etapa 2: Segmento de Mercado & Inteligência RAON</h3>
              <p className="text-xs text-[#94A3B8]">
                Selecione o segmento para aplicar automaticamente funil, automações e métricas calibradas pelo Método RAON 360°.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Imobiliária', 'Clínica', 'Advocacia', 'Varejo', 'Serviços', 'Educação', 'Restaurante', 'Outros'] as const).map(seg => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        segment: seg,
                        averageTicket: SEGMENT_RECOMMENDATIONS[seg]?.suggestedTicket || formData.averageTicket
                      });
                    }}
                    className={`p-3 rounded-xl border text-left font-medium transition ${
                      formData.segment === seg
                        ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-white shadow-xs'
                        : 'bg-[#080B14] border-[#151C2C] text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">{seg}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Template Ativo</div>
                  </button>
                ))}
              </div>

              {/* Box de recomendação do segmento */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#38BDF8]/30 space-y-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
                  <Sparkles className="w-4 h-4 text-[#FF7A18]" />
                  <span>Configuração Sugerida para {formData.segment}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-[#94A3B8] pt-1">
                  <div>
                    <span className="font-semibold text-white block">Funil Recomendado:</span>
                    <span>{currentRecommendation.funnelStages.join(' → ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Automações Ativadas:</span>
                    <span>{currentRecommendation.automations.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Ticket Médio Base:</span>
                    <span className="text-[#22C55E] font-mono font-bold">R$ {currentRecommendation.suggestedTicket.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EQUIPE & RESPONSÁVEL */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Etapa 3: Equipe RAON & Plano Contratado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Plano Contratado</label>
                  <select
                    value={formData.plan}
                    onChange={e => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  >
                    <option value="Starter - R$ 6.500/mês">Starter - R$ 6.500/mês</option>
                    <option value="Growth - R$ 8.900/mês">Growth - R$ 8.900/mês</option>
                    <option value="Scale - R$ 12.500/mês">Scale - R$ 12.500/mês</option>
                    <option value="Enterprise - R$ 25.000/mês">Enterprise - R$ 25.000/mês</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Responsável Técnico RAON</label>
                  <select
                    value={formData.raonResponsible}
                    onChange={e => setFormData({ ...formData, raonResponsible: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  >
                    <option value="Thiago Pinheiro (CEO)">Thiago Pinheiro (CEO)</option>
                    <option value="Mateus Lima (Líder de Criativos)">Mateus Lima (Líder de Criativos)</option>
                    <option value="Gabriela Alencar (Administradora)">Gabriela Alencar (Administradora)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Status Inicial</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  >
                    <option value="active">Ativo (Em Operação)</option>
                    <option value="onboarding">Onboarding Técnico</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Data de Entrada</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FUNIL */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Etapa 4: Funil Comercial Pré-Configurado</h3>
              <p className="text-xs text-[#94A3B8]">
                Etapas do Kanban que guiarão a equipe de vendas deste cliente:
              </p>
              <div className="space-y-2">
                {currentRecommendation.funnelStages.map((stg, i) => (
                  <div key={stg} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-[#151C2C]">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center font-mono text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-white">{stg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: CANAIS */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Etapa 5: Canais de Aquisição</h3>
              <p className="text-xs text-[#94A3B8]">
                Canais integrados para captação de leads e campanhas:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Meta Ads (Instagram & Facebook)', 'Google Ads (Pesquisa & Rede)', 'WhatsApp Business API', 'Landing Pages RAON'].map(ch => (
                  <div key={ch} className="p-3 rounded-lg bg-[#080B14] border border-[#22C55E]/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span className="font-medium text-white">{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: OBJETIVOS E METAS */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Etapa 6: Metas Financeiras & Comerciais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Meta Mensal de Vendas (R$)</label>
                  <input
                    type="number"
                    value={formData.monthlyTarget}
                    onChange={e => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Ticket Médio Estimado (R$)</label>
                  <input
                    type="number"
                    value={formData.averageTicket}
                    onChange={e => setFormData({ ...formData, averageTicket: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: CONCLUSÃO E PRONTO */}
          {step === 7 && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#FF7A18] to-[#2563EB] flex items-center justify-center text-white mx-auto shadow-xl shadow-[#FF7A18]/30">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                SUA INFRAESTRUTURA ESTÁ PRONTA.
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                O cliente <b>{formData.name || 'Nova Empresa'}</b> será provisionado no modelo multi-tenant com isolamento total de dados, funil {formData.segment} e automações ativas.
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#151C2C] bg-[#080B14] flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-3.5 py-1.5 rounded-lg border border-[#151C2C] text-xs font-semibold text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-semibold transition flex items-center gap-1"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/25"
            >
              Finalizar & Ativar Infraestrutura
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
