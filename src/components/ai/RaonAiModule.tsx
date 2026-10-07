import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, User, AlertCircle, 
  TrendingUp, Lightbulb, RefreshCw, ChevronRight, Zap
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const RaonAiModule: React.FC = () => {
  const { leads, deals, campaigns, clients, tasks, aiInsights } = useData();
  const { currentOrg } = useAuth();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Olá! Sou o **RAON AI**, sua inteligência de crescimento baseada no **Método RAON 360°**.\n\nEstou conectado aos dados em tempo real da organização **${currentOrg.name}**.\n\nVocê pode me fazer perguntas sobre leads parados, performance de campanhas, taxa de conversão da equipe comercial ou saúde de clientes.`,
      time: 'Agora',
    },
  ]);

  const quickPrompts = [
    'Quantos leads tivemos este mês?',
    'Qual campanha trouxe mais vendas?',
    'Qual vendedor converte melhor?',
    'Quais leads estão parados há mais de 24 horas?',
    'Quais clientes estão em risco de churn?',
    'Qual campanha possui o melhor ROI / ROAS?',
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    const contextData = {
      organizationName: currentOrg.name,
      totalLeads: leads.length,
      leadsByStage: {
        novo_lead: leads.filter(l => l.stage === 'novo_lead').length,
        contato: leads.filter(l => l.stage === 'contato').length,
        qualificado: leads.filter(l => l.stage === 'qualificado').length,
        orcamento: leads.filter(l => l.stage === 'orcamento').length,
        negociacao: leads.filter(l => l.stage === 'negociacao').length,
        ganho: deals.filter(d => d.status === 'won').length,
      },
      campaigns: campaigns.map(c => ({
        name: c.name,
        channel: c.channel,
        spent: c.spent,
        leads: c.leads,
        sales: c.sales,
        revenue: c.revenue,
      })),
      clientsCount: clients.length,
      atRiskClients: clients.filter(c => c.churnRisk > 40).map(c => ({ name: c.name, risk: c.churnRisk })),
      pendingTasks: tasks.filter(t => t.status === 'pending' || t.status === 'overdue').length,
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: contextData,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta da IA');
      }

      const data = await response.json();
      const aiMsg = {
        sender: 'ai' as const,
        text: data.text || 'Análise concluída com base nos indicadores.',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const fallbackAnalysis = `### Análise RAON 360° para: "${text}"\n\n- **Leads no Pipeline:** ${leads.length} leads registrados no tenant atual.\n- **Campanha Destaque:** ${campaigns[0]?.name || 'Meta Ads'} com R$ ${campaigns[0]?.revenue || 420000} em receita gerada.\n- **Taxa de Conversão:** ${(deals.filter(d => d.status === 'won').length / (leads.length || 1) * 100).toFixed(1)}%.\n- **Recomendação Estratégica:** Priorizar follow-up imediato nos leads com propostas abertas e manter cadência ativa.`;
      setMessages(prev => [
        ...prev, 
        {
          sender: 'ai',
          text: fallbackAnalysis,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-linear-to-r from-[#101522] via-[#151C2C] to-[#101522] border border-[#38BDF8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded border border-[#38BDF8]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF7A18]" />
              MÉTODO RAON 360° — INTELIGÊNCIA
            </span>
            <span className="text-xs text-[#94A3B8]">RAON AI COPILOT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Inteligência Artificial de Crescimento
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Diagnósticos executivos, detecção de anomalias no funil, previsão de churn e análise de ROI com tecnologia Gemini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Gemini 3.8 Flash Ativo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map(insight => (
          <div 
            key={insight.id}
            className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                insight.type === 'alert' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                insight.type === 'opportunity' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                'bg-[#38BDF8]/20 text-[#38BDF8]'
              }`}>
                {insight.type === 'alert' ? 'ALERTA' : insight.type === 'opportunity' ? 'OPORTUNIDADE' : 'RECOMENDAÇÃO'}
              </span>
              <span className="text-[10px] text-[#94A3B8]">{insight.createdAt}</span>
            </div>
            <h3 className="font-bold text-xs text-white">
              {insight.title}
            </h3>
            <p className="text-xs text-[#94A3B8]">
              {insight.description}
            </p>
            {insight.actionLabel && (
              <button 
                onClick={() => handleSendMessage(`Como executar a recomendação: ${insight.title}?`)}
                className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1 pt-1"
              >
                <span>{insight.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#101522] border border-[#151C2C] rounded-2xl shadow-xl flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#2563EB] to-[#38BDF8] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div 
                className={`max-w-2xl p-4 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#2563EB] text-white rounded-tr-none'
                    : 'bg-[#080B14] border border-[#151C2C] text-[#F8FAFC] rounded-tl-none'
                }`}
              >
                {msg.text}
                <span className="text-[9px] text-[#94A3B8] block text-right mt-1">
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-[#151C2C] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#38BDF8]" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-[#94A3B8]">
                RAON AI analisando dados do CRM e calculando métricas do Método 360°...
              </div>
            </div>
          )}
        </div>

        <div className="p-2.5 bg-[#080B14] border-t border-[#151C2C] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] text-[#94A3B8] font-bold uppercase shrink-0 px-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#FF7A18]" /> Perguntas:
          </span>
          {quickPrompts.map(qp => (
            <button
              key={qp}
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-lg bg-[#151C2C] hover:bg-[#2563EB]/20 hover:text-[#38BDF8] border border-[#151C2C] text-[#94A3B8] text-[11px] font-medium whitespace-nowrap transition"
            >
              {qp}
            </button>
          ))}
        </div>

        <div className="p-3 bg-[#101522] border-t border-[#151C2C]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pergunte ao RAON AI sobre conversão, campanhas, metas ou clientes em risco..."
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-[#FF7A18]/20 flex items-center gap-1.5"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
