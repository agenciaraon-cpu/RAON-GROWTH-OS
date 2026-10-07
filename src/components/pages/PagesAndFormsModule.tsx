import React, { useState } from 'react';
import { 
  FileSpreadsheet, Plus, ExternalLink, Copy, CheckCircle2, 
  Eye, Sparkles, Send, ArrowRight, Share2, Globe, ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const PagesAndFormsModule: React.FC = () => {
  const { addLead } = useData();
  const { currentOrg } = useAuth();

  const [activeTab, setActiveTab] = useState<'pages' | 'form_preview'>('pages');
  const [formSuccess, setFormSuccess] = useState(false);

  // Form simulator state
  const [testLead, setTestLead] = useState({
    name: 'Juliana Freitas',
    whatsapp: '11998877665',
    email: 'juliana.freitas@investimentos.com',
    company: 'Freitas Capital',
    service: 'Consultoria Imobiliária & Private Equity',
    city: 'São Paulo',
    state: 'SP',
  });

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      organizationId: currentOrg.id,
      name: testLead.name,
      phone: testLead.whatsapp,
      whatsapp: testLead.whatsapp,
      email: testLead.email,
      company: testLead.company,
      service: testLead.service,
      city: testLead.city,
      state: testLead.state,
      origin: 'Landing Page',
      campaignName: 'Página de Captura Oficial — RAON Pages',
      responsible: 'Roberto Lima (SDR)',
      stage: 'novo_lead',
      potentialValue: 48000,
      notes: 'Lead gerado via formulário da landing page oficial. Entrada instantânea.',
      nextAction: 'Contato imediato via WhatsApp oficial',
    });

    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const pages = [
    {
      id: 'p1',
      title: 'Lançamento Penthouse Jardins',
      slug: 'alpha-jardins',
      views: 12480,
      conversions: 184,
      rate: '14.7%',
      status: 'published',
      url: 'https://raon.pages.app/alpha-jardins',
    },
    {
      id: 'p2',
      title: 'Protocolo Exclusivo de Harmonização',
      slug: 'lumina-protocolo',
      views: 8940,
      conversions: 145,
      rate: '16.2%',
      status: 'published',
      url: 'https://raon.pages.app/lumina-protocolo',
    },
    {
      id: 'p3',
      title: 'Recuperação Tributária Empresas',
      slug: 'vanguard-tributario',
      views: 4210,
      conversions: 38,
      rate: '9.0%',
      status: 'published',
      url: 'https://raon.pages.app/vanguard-tributario',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              CONVERSÃO & CAPTAÇÃO
            </span>
            <span className="text-xs text-[#94A3B8]">RAON PAGES & FORMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Landing Pages & Formulários de Alta Conversão
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Páginas otimizadas para tráfego pago com integração direta ao pipeline do CRM e disparos de automação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#080B14] p-1 rounded-xl border border-[#151C2C] text-xs">
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'pages' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Páginas ({pages.length})
            </button>
            <button
              onClick={() => setActiveTab('form_preview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'form_preview' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Simulador Form → CRM
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: PAGES LIST */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pages.map(page => (
            <div key={page.id} className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col justify-between shadow-lg space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#22C55E]/15 text-[#22C55E]">
                    Publicada
                  </span>
                  <span className="text-xs text-[#94A3B8] font-mono">{page.rate} conversão</span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">
                  {page.title}
                </h3>
                <span className="text-xs text-[#38BDF8] font-mono break-all mt-1 block">
                  {page.url}
                </span>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#151C2C] text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Acessos:</span>
                    <span className="font-mono font-bold text-white">{page.views.toLocaleString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Leads Gerados:</span>
                    <span className="font-mono font-bold text-[#22C55E]">{page.conversions}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#151C2C] flex items-center justify-between">
                <span className="text-[10px] text-[#94A3B8]">CAPI Meta & GA4 Ativo</span>
                <button
                  onClick={() => setActiveTab('form_preview')}
                  className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-semibold transition flex items-center gap-1"
                >
                  <span>Testar Envio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: FORM SIMULATOR */}
      {activeTab === 'form_preview' && (
        <div className="max-w-xl mx-auto bg-[#101522] border border-[#151C2C] rounded-2xl p-6 shadow-2xl space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] font-bold uppercase">
              <Globe className="w-4 h-4 text-[#FF7A18]" />
              <span>Simulador em Tempo Real: RAON Form → CRM</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Envio de Formulário & Captura Automática
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Ao submeter este formulário, o lead entra instantaneamente no CRM no estágio "NOVO LEAD" e aciona a automação.
            </p>
          </div>

          {formSuccess && (
            <div className="p-4 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-xs text-[#22C55E] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <b>Lead capturado com sucesso!</b> Criado no CRM, vinculado à organização e pronto para atendimento imediato.
              </div>
            </div>
          )}

          <form onSubmit={handleSimulateSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Nome Completo</label>
              <input
                type="text"
                required
                value={testLead.name}
                onChange={e => setTestLead({ ...testLead, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">WhatsApp</label>
                <input
                  type="text"
                  required
                  value={testLead.whatsapp}
                  onChange={e => setTestLead({ ...testLead, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">E-mail</label>
                <input
                  type="email"
                  required
                  value={testLead.email}
                  onChange={e => setTestLead({ ...testLead, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Serviço de Interesse</label>
              <input
                type="text"
                value={testLead.service}
                onChange={e => setTestLead({ ...testLead, service: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-[#FF7A18]/25 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Simular Envio de Lead para o CRM</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
