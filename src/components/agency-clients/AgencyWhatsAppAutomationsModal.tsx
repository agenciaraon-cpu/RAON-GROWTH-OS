import React, { useState, useEffect } from 'react';
import { 
  X, MessageSquare, Check, Sparkles, AlertTriangle, 
  Clock, Play, Settings, ExternalLink, Send, ShieldCheck, CheckCircle2, 
  Phone, DollarSign, Info, Copy, Zap, HelpCircle, ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AgencyClient, AgencyWhatsAppConfig, ClientAutomationRule, WhatsAppMessageLog } from '../../types';

interface AgencyWhatsAppAutomationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CONFIG: AgencyWhatsAppConfig = {
  provider: 'direct_web',
  businessPhone: '(11) 99876-5432',
  instanceId: '',
  apiKey: '',
  webhookUrl: '',
  isConnected: true,
  pixKey: 'financeiro@agenciaraon.com.br (Chave Pix)',
  mode: 'direct_web',
};

const DEFAULT_RULES: ClientAutomationRule[] = [
  {
    id: 'rule-overdue-3days',
    type: 'overdue_3days',
    title: 'Cobrança por Atraso (+3 dias após vencimento)',
    enabled: true,
    scheduleTime: '10:00',
    daysDelay: 3,
    sentCount: 14,
    lastTriggeredAt: 'Hoje às 10:00',
    messageTemplate: `Olá, {nome_cliente}! Tudo bem? Aqui é da equipe financeira da Agência RAON.\n\nPassando para lembrar que a mensalidade da {empresa} referente aos serviços de marketing, gestão de Instagram e tráfego pago (vencimento dia {dia_vencimento}) completou {dias_atraso} dias de atraso no valor de {valor_mensal}.\n\nPara facilitar a regularização, segue nossa chave Pix:\n{chave_pix}\n\nCaso já tenha efetuado o pagamento, por favor nos envie o comprovante por aqui. Qualquer dúvida estamos à disposição! 🚀`,
  },
  {
    id: 'rule-monday',
    type: 'monday_greeting',
    title: 'Relacionamento & Foco: Início de Semana (Segunda-feira)',
    enabled: true,
    scheduleTime: '08:30',
    sentCount: 38,
    lastTriggeredAt: 'Segunda-feira às 08:30',
    messageTemplate: `Bom dia, {nome_cliente}! 🚀\n\nDesejamos a você e a toda equipe da {empresa} uma excelente e produtiva semana de trabalho!\n\nNossa equipe de tráfego e criativos da RAON já está revisando as campanhas e o cronograma do Instagram para acelerar as conversões e vendas nesta semana.\n\nContem conosco para o que precisarem! 🤝`,
  },
  {
    id: 'rule-saturday',
    type: 'saturday_weekend',
    title: 'Relacionamento & Parceria: Fim de Semana (Sábado)',
    enabled: true,
    scheduleTime: '09:00',
    sentCount: 38,
    lastTriggeredAt: 'Sábado às 09:00',
    messageTemplate: `Olá, {nome_cliente}! ✨\n\nPassando para desejar um ótimo final de semana de descanso e lazer para você e sua família!\n\nLembrando que suas campanhas de tráfego pago continuam rodando 24 horas por dia no piloto automático, captando contatos e oportunidades para a {empresa}.\n\nNa segunda-feira estaremos de volta a todo vapor. Um grande abraço da equipe RAON!`,
  },
];

export const AgencyWhatsAppAutomationsModal: React.FC<AgencyWhatsAppAutomationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { agencyClients } = useData();

  const [activeTab, setActiveTab] = useState<'quick_send' | 'rules' | 'test' | 'config' | 'guide'>('quick_send');
  const [selectedQueueCategory, setSelectedQueueCategory] = useState<'overdue_3days' | 'monday_greeting' | 'saturday_weekend'>('overdue_3days');

  // Load saved config or defaults from localStorage
  const [config, setConfig] = useState<AgencyWhatsAppConfig>(() => {
    const saved = localStorage.getItem('raon_agency_whatsapp_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [rules, setRules] = useState<ClientAutomationRule[]>(() => {
    const saved = localStorage.getItem('raon_agency_whatsapp_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_RULES;
      }
    }
    return DEFAULT_RULES;
  });

  const [selectedClientForTest, setSelectedClientForTest] = useState<AgencyClient>(
    agencyClients[0] || null
  );

  const [testRuleType, setTestRuleType] = useState<ClientAutomationRule['type']>('overdue_3days');
  const [logs, setLogs] = useState<WhatsAppMessageLog[]>(() => {
    const saved = localStorage.getItem('raon_agency_whatsapp_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasOldLogs = Array.isArray(parsed) && parsed.some((l: any) => l.companyName?.includes('Alencar') || l.companyName?.includes('Torres'));
        if (!hasOldLogs && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'log-1',
        clientName: 'Paulino Carvalho',
        companyName: 'CARVALHO RELÓGIOS',
        phone: '(75) 99260-5781',
        type: 'overdue_3days',
        message: 'Lembrete amigável de mensalidade enviado (+3 dias de atraso - R$ 300,00).',
        status: 'sent',
        sentAt: 'Hoje às 10:02',
      },
      {
        id: 'log-2',
        clientName: 'Robison',
        companyName: 'VISÃO INVENTÁRIO',
        phone: '(71) 98303-2979',
        type: 'monday_greeting',
        message: 'Mensagem de início de semana e alinhamento de campanhas de tráfego enviada.',
        status: 'sent',
        sentAt: 'Segunda-feira às 08:30',
      },
    ];
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('raon_agency_whatsapp_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('raon_agency_whatsapp_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('raon_agency_whatsapp_logs', JSON.stringify(logs));
  }, [logs]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
    showNotification('Status da automação atualizado!');
  };

  const handleUpdateTemplate = (ruleId: string, newTemplate: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, messageTemplate: newTemplate } : r));
  };

  // Compile dynamic message with real client tags
  const compileMessage = (template: string, client?: AgencyClient | null, daysDelay: number = 3) => {
    if (!client) return template;
    return template
      .replace(/{nome_cliente}/g, client.clientName)
      .replace(/{empresa}/g, client.companyName)
      .replace(/{dia_vencimento}/g, String(client.dueDay < 10 ? `0${client.dueDay}` : client.dueDay))
      .replace(/{valor_mensal}/g, `R$ ${client.monthlyValue.toLocaleString('pt-BR')}`)
      .replace(/{dias_atraso}/g, String(daysDelay))
      .replace(/{chave_pix}/g, config.pixKey || 'financeiro@agenciaraon.com.br')
      .replace(/{plano}/g, client.plan);
  };

  // Dispatch message to WhatsApp Web or Desktop
  const handleSendMessageToClient = (client: AgencyClient, ruleType: ClientAutomationRule['type']) => {
    const targetRule = rules.find(r => r.type === ruleType) || rules[0];
    const text = compileMessage(targetRule.messageTemplate, client, targetRule.daysDelay || 3);
    const cleanPhone = client.phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/55${cleanPhone}?text=${encoded}`;

    // Add to logs
    const newLog: WhatsAppMessageLog = {
      id: `log-${Date.now()}`,
      clientName: client.clientName,
      companyName: client.companyName,
      phone: client.phone,
      type: ruleType,
      message: text,
      status: 'sent',
      sentAt: 'Agora há pouco',
    };

    setLogs(prev => [newLog, ...prev]);
    showNotification(`Abrindo WhatsApp para enviar mensagem para ${client.clientName} (${client.companyName})...`);

    window.open(waUrl, '_blank');
  };

  const handleCopyMessage = (client: AgencyClient, ruleType: ClientAutomationRule['type']) => {
    const targetRule = rules.find(r => r.type === ruleType) || rules[0];
    const text = compileMessage(targetRule.messageTemplate, client, targetRule.daysDelay || 3);
    navigator.clipboard.writeText(text);
    setCopiedId(client.id);
    showNotification(`Mensagem copiada para a área de transferência!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter clients for Quick Dispatch Queue
  const overdueClients = agencyClients.filter(c => c.paymentStatus === 'overdue');
  const allActiveClients = agencyClients;

  const currentQueueList = selectedQueueCategory === 'overdue_3days' 
    ? (overdueClients.length > 0 ? overdueClients : agencyClients.slice(0, 2)) // show overdue or preview
    : allActiveClients;

  const activeRule = rules.find(r => r.type === testRuleType) || rules[0];
  const compiledTestMessage = compileMessage(activeRule.messageTemplate, selectedClientForTest, activeRule.daysDelay || 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="w-full max-w-5xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#151C2C] bg-[#080B14] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white shadow-lg shadow-[#22C55E]/20 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  WhatsApp da Agência RAON — Cobranças & Relacionamento
                </h2>
                {config.provider === 'direct_web' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#22C55E]" />
                    MODO 1-CLIQUE (SEM API / 100% GRÁTIS)
                  </span>
                ) : (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                    config.isConnected 
                      ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30' 
                      : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.isConnected ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'}`} />
                    {config.isConnected ? 'API CONECTADA' : 'SEM API CONFIGURADA'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Número da Agência: <b className="text-white font-mono">{config.businessPhone}</b> • Cobrança automática de 3 dias e mensagens de segunda e sábado.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner: Tranquilidade para quem não tem conta Z-API/Evolution */}
        <div className="px-4 py-2 bg-linear-to-r from-[#22C55E]/10 via-[#101522] to-[#2563EB]/10 border-b border-[#22C55E]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
            <span>
              <b>Não tem conta na Z-API ou Evolution API?</b> Fique tranquilo! Você pode usar agora mesmo o <b>Disparo em 1 Clique via WhatsApp Web</b> sem gastar R$ 1 e sem cadastro em API.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('guide')}
            className="text-[11px] text-[#38BDF8] hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ver Opções Gratuitas & Passo a Passo</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notificationMsg && (
          <div className="px-5 py-2.5 bg-[#22C55E]/15 border-b border-[#22C55E]/30 text-xs text-[#22C55E] flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Sub-nav tabs */}
        <div className="flex border-b border-[#151C2C] bg-[#080B14]/70 px-4 sm:px-5 gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('quick_send')}
            className={`py-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quick_send'
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Fila de Disparo 1-Clique (Imediato)</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Regras & Mensagens (3 Prontas)</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'test'
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Simulador com Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-[#38BDF8] text-[#38BDF8]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
            <span>Como Ter API Grátis (Guia)</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-[#22C55E] text-[#22C55E]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Conexão da API & Pix</span>
          </button>
        </div>

        {/* TAB 1: FILA DE DISPARO EM 1-CLIQUE (FUNCIONA SEM PRECISAR DE NENHUMA API) */}
        {activeTab === 'quick_send' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Explicação da Fila */}
            <div className="p-4 rounded-xl bg-linear-to-r from-[#101522] via-[#0B141A] to-[#101522] border border-[#22C55E]/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Disparo Inteligente Direto (Sem Gastos com API)
                </span>
                <p className="text-xs text-[#E2E8F0]">
                  O sistema identifica os clientes elegíveis, substitui todas as tags ({'{nome_cliente}'}, {'{empresa}'}, {'{valor_mensal}'}, {'{chave_pix}'}) e ao clicar em <b>"Enviar no WhatsApp"</b> abre a conversa no seu próprio WhatsApp Web ou no app do celular com o texto 100% pronto.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#94A3B8] font-mono">Chave Pix:</span>
                <span className="px-2 py-1 rounded bg-[#080B14] border border-[#151C2C] text-xs font-mono text-white">
                  {config.pixKey}
                </span>
              </div>
            </div>

            {/* Seleção do Tipo de Disparo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedQueueCategory('overdue_3days')}
                className={`p-3.5 rounded-xl border text-left transition relative ${
                  selectedQueueCategory === 'overdue_3days'
                    ? 'bg-[#EF4444]/15 border-[#EF4444] shadow-md shadow-[#EF4444]/10'
                    : 'bg-[#080B14] border-[#151C2C] hover:border-[#EF4444]/40 text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    <span>Cobrança Atraso (+3 Dias)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444]">
                    {overdueClients.length} Pendentes
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1.5 line-clamp-2">
                  Lembrete amigável com valor, dias em aberto e Chave Pix para quitação imediata.
                </p>
              </button>

              <button
                onClick={() => setSelectedQueueCategory('monday_greeting')}
                className={`p-3.5 rounded-xl border text-left transition relative ${
                  selectedQueueCategory === 'monday_greeting'
                    ? 'bg-[#22C55E]/15 border-[#22C55E] shadow-md shadow-[#22C55E]/10'
                    : 'bg-[#080B14] border-[#151C2C] hover:border-[#22C55E]/40 text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Play className="w-4 h-4 text-[#22C55E]" />
                    <span>Início de Semana (Segunda)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22C55E]/20 text-[#22C55E]">
                    {allActiveClients.length} Clientes
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1.5 line-clamp-2">
                  Deseja ótima semana e reforça o trabalho do Instagram e tráfego pago da agência.
                </p>
              </button>

              <button
                onClick={() => setSelectedQueueCategory('saturday_weekend')}
                className={`p-3.5 rounded-xl border text-left transition relative ${
                  selectedQueueCategory === 'saturday_weekend'
                    ? 'bg-[#38BDF8]/15 border-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                    : 'bg-[#080B14] border-[#151C2C] hover:border-[#38BDF8]/40 text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                    <span>Fim de Semana (Sábado)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38BDF8]/20 text-[#38BDF8]">
                    {allActiveClients.length} Clientes
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1.5 line-clamp-2">
                  Deseja descanso e lembra que os anúncios continuam rodando 24 horas.
                </p>
              </button>
            </div>

            {/* Lista de Clientes da Categoria Selecionada */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Clientes Elegíveis para Envio Imediato:</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  Total na fila: <b className="text-white">{currentQueueList.length}</b>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQueueList.map(client => {
                  const targetRule = rules.find(r => r.type === selectedQueueCategory) || rules[0];
                  const previewText = compileMessage(targetRule.messageTemplate, client, targetRule.daysDelay || 3);

                  return (
                    <div
                      key={client.id}
                      className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] hover:border-[#22C55E]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-sm font-bold text-white">
                            {client.companyName}
                          </h4>
                          <span className="text-xs text-[#94A3B8]">
                            ({client.clientName})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            client.paymentStatus === 'paid'
                              ? 'bg-[#22C55E]/15 text-[#22C55E]'
                              : client.paymentStatus === 'pending'
                              ? 'bg-[#FF9F43]/15 text-[#FF9F43]'
                              : 'bg-[#EF4444]/15 text-[#EF4444]'
                          }`}>
                            {client.paymentStatus === 'paid' ? 'Pago' : client.paymentStatus === 'pending' ? 'Pendente' : 'Atrasado'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101522] text-[#38BDF8]">
                            Plano {client.plan} • R$ {client.monthlyValue.toLocaleString('pt-BR')} (Vence dia {client.dueDay})
                          </span>
                        </div>

                        <p className="text-xs text-[#94A3B8] font-mono">
                          WhatsApp: <b className="text-[#22C55E]">{client.phone}</b>
                        </p>

                        <div className="p-2.5 rounded-lg bg-[#101522] border border-[#151C2C] text-[11px] text-[#CBD5E1] line-clamp-2 font-mono">
                          {previewText}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyMessage(client, selectedQueueCategory)}
                          className="px-3 py-2 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8] text-xs font-semibold text-[#94A3B8] hover:text-white transition flex items-center gap-1.5"
                          title="Copiar texto para colar manualmente"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedId === client.id ? 'Copiado!' : 'Copiar'}</span>
                        </button>

                        <button
                          onClick={() => handleSendMessageToClient(client, selectedQueueCategory)}
                          className="px-4 py-2 rounded-xl bg-linear-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#22C55E]/20 flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar no WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGRAS & MODELOS DE MENSAGEM */}
        {activeTab === 'rules' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#22C55E]/30 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <div className="text-xs text-[#94A3B8]">
                <b className="text-white">Personalização Livre dos Textos:</b>
                <p className="mt-0.5">
                  Você pode editar livremente as 3 mensagens abaixo. O sistema preenche dinamicamente as variáveis de cada cliente ao disparar.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border transition ${
                    rule.enabled
                      ? 'bg-[#080B14] border-[#22C55E]/40 shadow-sm'
                      : 'bg-[#080B14]/50 border-[#151C2C] opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#151C2C]">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        rule.type === 'overdue_3days' 
                          ? 'bg-[#EF4444]/20 text-[#EF4444]' 
                          : rule.type === 'monday_greeting'
                          ? 'bg-[#22C55E]/20 text-[#22C55E]'
                          : 'bg-[#38BDF8]/20 text-[#38BDF8]'
                      }`}>
                        {rule.type === 'overdue_3days' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : rule.type === 'monday_greeting' ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{rule.title}</span>
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-0.5 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#FF9F43]" />
                            <span>Horário Sugerido: {rule.scheduleTime}</span>
                          </span>
                          <span>•</span>
                          <span className="text-[#22C55E]">{rule.sentCount} disparos registrados</span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${rule.enabled ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
                        {rule.enabled ? 'Ativa' : 'Pausada'}
                      </span>
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                          rule.enabled ? 'bg-[#22C55E]' : 'bg-[#151C2C]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            rule.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Template Editor */}
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                      Template da Mensagem (pode ser editado livremente):
                    </label>
                    <textarea
                      rows={5}
                      value={rule.messageTemplate}
                      onChange={e => handleUpdateTemplate(rule.id, e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#22C55E] outline-hidden font-mono leading-relaxed"
                    />

                    {/* Tags Pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5 items-center text-[10px]">
                      <span className="text-[#94A3B8] font-medium">Tags dinâmicas disponíveis:</span>
                      {['{nome_cliente}', '{empresa}', '{valor_mensal}', '{dia_vencimento}', '{dias_atraso}', '{chave_pix}'].map(tag => (
                        <span 
                          key={tag} 
                          className="px-1.5 py-0.5 rounded bg-[#101522] border border-[#2563EB]/40 text-[#38BDF8] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SIMULADOR DE MENSAGENS COM CLIENTES REAIS */}
        {activeTab === 'test' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seleção do Cliente e Regra */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    1. Escolha qual cliente da agência testar:
                  </label>
                  <select
                    value={selectedClientForTest?.id || ''}
                    onChange={e => {
                      const found = agencyClients.find(c => c.id === e.target.value);
                      if (found) setSelectedClientForTest(found);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#22C55E] outline-hidden font-medium"
                  >
                    {agencyClients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} — {c.clientName} ({c.plan} • Vence dia {c.dueDay} • {c.paymentStatus.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    2. Escolha qual das 3 mensagens simular:
                  </label>
                  <div className="space-y-2">
                    {rules.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setTestRuleType(r.type)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                          testRuleType === r.type
                            ? 'bg-[#22C55E]/15 border-[#22C55E] text-white font-semibold'
                            : 'bg-[#080B14] border-[#151C2C] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        <span>{r.title}</span>
                        {testRuleType === r.type && <Check className="w-4 h-4 text-[#22C55E]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dados do Cliente Selecionado */}
                {selectedClientForTest && (
                  <div className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#FF7A18]">
                      Dados Carregados do Cliente
                    </span>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Responsável:</span>
                      <span className="text-white font-medium">{selectedClientForTest.clientName}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Empresa:</span>
                      <span className="text-white font-medium">{selectedClientForTest.companyName}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Telefone / WhatsApp:</span>
                      <span className="text-[#22C55E] font-mono font-medium">{selectedClientForTest.phone}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Mensalidade:</span>
                      <span className="text-white font-mono font-medium">
                        R$ {selectedClientForTest.monthlyValue.toLocaleString('pt-BR')} (Dia {selectedClientForTest.dueDay})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview da Mensagem Formatada no WhatsApp */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#22C55E]" />
                  <span>Prévia Real da Mensagem no WhatsApp:</span>
                </label>

                <div className="flex-1 p-4 rounded-2xl bg-[#0B141A] border border-[#22C55E]/30 relative flex flex-col justify-between">
                  <div className="p-3.5 rounded-xl bg-[#005C4B] text-white text-xs leading-relaxed whitespace-pre-line shadow-md">
                    {compiledTestMessage}
                    <div className="text-[9px] text-[#A9DDD6] text-right mt-1 font-mono">
                      10:00 ✓✓
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F2C34]">
                    <button
                      onClick={() => handleSendMessageToClient(selectedClientForTest, testRuleType)}
                      className="w-full py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold transition shadow-lg shadow-[#22C55E]/25 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Abrir e Testar Envio no WhatsApp Web</span>
                    </button>
                    <p className="text-[10px] text-[#94A3B8] text-center mt-1.5">
                      Abre a mensagem preenchida diretamente com o cliente selecionado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico Recente de Disparos */}
            <div className="pt-3 border-t border-[#151C2C]">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Histórico de Mensagens Disparadas:</span>
              </h4>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[#080B14] border border-[#151C2C] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{log.companyName} ({log.clientName})</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#22C55E]/15 text-[#22C55E]">
                          ENVIADO
                        </span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5 truncate max-w-md">
                        {log.message.slice(0, 70)}...
                      </div>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono shrink-0">
                      {log.sentAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GUIA DETALHADO — O QUE FAZER SE NÃO TIVER CONTA EM API */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="p-4 rounded-xl bg-linear-to-r from-[#22C55E]/15 via-[#101522] to-[#2563EB]/15 border border-[#22C55E]/30 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#22C55E]" />
                <span>"Não tenho conta na Z-API ou Evolution API e agora?" — Resposta & Soluções:</span>
              </h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Você <b>não precisa pagar nada</b> e nem criar conta nenhuma para começar a enviar as mensagens automáticas hoje mesmo! Veja as 4 opções práticas abaixo:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opção 1: WhatsApp Web 1-Clique (Imediata) */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#22C55E]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1.5 uppercase font-mono">
                    <Zap className="w-4 h-4" />
                    Opção 1: Modo 1-Clique (Recomendada Agora)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#22C55E]/20 text-[#22C55E] font-bold">
                    100% GRÁTIS
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Disparo sem Nenhuma API (WhatsApp Web/App)</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  O próprio sistema RAON GROWTH OS já calcula quem está atrasado (+3 dias) e monta as saudações de segunda e sábado. Você só clica no botão verde <b>"Enviar no WhatsApp"</b> na aba <b>"Fila de Disparo 1-Clique"</b>.
                </p>
                <ul className="text-[11px] text-[#CBD5E1] space-y-1 list-disc list-inside">
                  <li><b>Custo:</b> R$ 0,00 (gratuito para sempre).</li>
                  <li><b>Configuração:</b> Nenhuma. Já está funcionando agora.</li>
                  <li><b>Segurança:</b> Risco zero de bloqueio porque é o seu próprio WhatsApp.</li>
                </ul>
                <button
                  onClick={() => setActiveTab('quick_send')}
                  className="w-full mt-2 py-2 rounded-lg bg-[#22C55E]/20 hover:bg-[#22C55E]/30 text-[#22C55E] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Ir para Fila de Disparo 1-Clique</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Opção 2: Evolution API (Open Source / Grátis) */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#38BDF8]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 uppercase font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    Opção 2: Evolution API (Código Aberto)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#38BDF8]/20 text-[#38BDF8] font-bold">
                    CÓDIGO ABERTO
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">A API de WhatsApp mais usada no Brasil</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  A <b>Evolution API</b> é 100% gratuita e de código aberto. Não cobra mensalidade por mensagem nem por instância. Você pode subir em servidores rápidos como Railway ou VPS de R$ 15/mês.
                </p>
                <ul className="text-[11px] text-[#CBD5E1] space-y-1 list-disc list-inside">
                  <li><b>Custo:</b> Grátis (sem licença paga).</li>
                  <li><b>Como funciona:</b> Gera um QR Code no painel para ler com o WhatsApp Business da agência.</li>
                  <li><b>Site Oficial:</b> evolution-api.com</li>
                </ul>
                <a
                  href="https://evolution-api.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-2 rounded-lg bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Conhecer Evolution API (evolution-api.com)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Opção 3: Meta WhatsApp Cloud API Oficial */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#2563EB]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 uppercase font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    Opção 3: WhatsApp Cloud API (Meta Oficial)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2563EB]/20 text-[#38BDF8] font-bold">
                    1.000 MSGS GRÁTIS/MÊS
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">API Oficial do Facebook / Meta</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  A própria Meta (dona do WhatsApp) oferece <b>1.000 conversas gratuitas todos os meses</b> para empresas. É a conexão oficial mais segura contra banimentos.
                </p>
                <ul className="text-[11px] text-[#CBD5E1] space-y-1 list-disc list-inside">
                  <li><b>Custo:</b> Grátis até 1.000 mensagens/mês.</li>
                  <li><b>Como obter:</b> Acessar <i>developers.facebook.com</i> com a conta da agência.</li>
                </ul>
                <a
                  href="https://developers.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-2 rounded-lg bg-[#2563EB]/20 hover:bg-[#2563EB]/30 text-[#38BDF8] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Acessar Meta for Developers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Opção 4: Z-API (Teste Gratuito) */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#FF7A18]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF7A18] flex items-center gap-1.5 uppercase font-mono">
                    <Sparkles className="w-4 h-4" />
                    Opção 4: Z-API (Teste Rápido de 7 Dias)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF7A18]/20 text-[#FF7A18] font-bold">
                    TESTE 7 DIAS
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Conexão por QR Code em 30 Segundos</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Se você quer testar a automação 100% no piloto automático sem subir servidor, a Z-API permite criar uma conta de testes grátis sem pedir cartão de crédito.
                </p>
                <ul className="text-[11px] text-[#CBD5E1] space-y-1 list-disc list-inside">
                  <li><b>Criação de Conta:</b> 1 minuto em <i>z-api.io</i>.</li>
                  <li><b>Como conectar:</b> Cria a instância de teste, escaneia o QR Code e cola o Token na aba "Conexão da API".</li>
                </ul>
                <a
                  href="https://z-api.io"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-2 rounded-lg bg-[#FF7A18]/20 hover:bg-[#FF7A18]/30 text-[#FF7A18] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Criar Conta de Teste na Z-API (z-api.io)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONFIGURAÇÃO DA API & CHAVE PIX */}
        {activeTab === 'config' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-4">
              <span className="font-bold text-xs text-white uppercase tracking-wider block text-[#22C55E]">
                Configurações da Conexão WhatsApp API & Chave Pix
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Provedor */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Método de Envio / Provedor
                  </label>
                  <select
                    value={config.provider}
                    onChange={e => setConfig({ ...config, provider: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white focus:border-[#22C55E] outline-hidden font-medium"
                  >
                    <option value="direct_web">Modo 1-Clique (WhatsApp Web — Sem API / 100% Grátis)</option>
                    <option value="zapi">Z-API (Instância com QR Code)</option>
                    <option value="evolution">Evolution API (Open Source / Grátis)</option>
                    <option value="meta_cloud">Meta WhatsApp Cloud API Oficial (1.000 msg/mês grátis)</option>
                  </select>
                </div>

                {/* Número do WhatsApp Business */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Número do WhatsApp Business da Agência RAON *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#22C55E] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={config.businessPhone}
                      onChange={e => setConfig({ ...config, businessPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white focus:border-[#22C55E] outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* ID da Instância */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    ID da Instância (Opcional — apenas se usar Z-API/Evolution)
                  </label>
                  <input
                    type="text"
                    placeholder="Deixe em branco se usar o Modo 1-Clique"
                    value={config.instanceId || ''}
                    onChange={e => setConfig({ ...config, instanceId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white focus:border-[#22C55E] outline-hidden font-mono"
                  />
                </div>

                {/* Chave de API / Token */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Token Secreto / Chave de API (Opcional)
                  </label>
                  <input
                    type="password"
                    placeholder="Deixe em branco se usar o Modo 1-Clique"
                    value={config.apiKey || ''}
                    onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white focus:border-[#22C55E] outline-hidden font-mono"
                  />
                </div>

                {/* Chave Pix para Cobrança */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Chave Pix Oficial da Agência RAON (Preenchida na mensagem de cobrança automática) *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-[#22C55E] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={config.pixKey || ''}
                      onChange={e => setConfig({ ...config, pixKey: e.target.value })}
                      placeholder="Ex: financeiro@agenciaraon.com.br (Chave Pix E-mail ou CNPJ)"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white focus:border-[#22C55E] outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Atual */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#22C55E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
                <div>
                  <div className="font-bold text-white">Status do Sistema: Pronto para Disparo</div>
                  <div className="text-[#94A3B8] text-[11px]">
                    {config.provider === 'direct_web' 
                      ? 'Operando em Modo 1-Clique sem dependência de APIs externas.' 
                      : 'Configurado para envio através do gateway selecionado.'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setConfig({ ...config, provider: 'direct_web' });
                  showNotification('Modo 1-Clique ativado com sucesso!');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] font-semibold transition shrink-0"
              >
                Definir Modo 1-Clique (Sem API)
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#080B14] border-t border-[#151C2C] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>Sistema configurado para o WhatsApp da Agência RAON.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                showNotification('Configurações do WhatsApp salvas com sucesso!');
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#22C55E]/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
