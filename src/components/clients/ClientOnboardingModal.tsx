import React, { useState } from 'react';
import { 
  X, Copy, Check, Send, Link, Building2, User, Phone, 
  Mail, Calendar, DollarSign, Sparkles, ShieldCheck, CheckCircle2,
  FileText, ExternalLink, ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AgencyPlan } from '../../types';

interface ClientOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientOnboardingModal: React.FC<ClientOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addAgencyClient } = useData();

  const [activeTab, setActiveTab] = useState<'link' | 'form'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state for manual client registration
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<AgencyPlan>('Prata');
  const [monthlyValue, setMonthlyValue] = useState<number>(500);
  const [dueDay, setDueDay] = useState<number>(10);
  const [services, setServices] = useState<string[]>([
    'Gestão de Instagram',
    'Tráfego Pago',
    'Criativos para Redes Sociais'
  ]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // The shareable invitation link for the client
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-vxfu5wgya7vbviseptbwri-80547597661.us-east5.run.app';
  const registrationLink = `${baseUrl}/?cadastro=empresa`;

  const invitationMessage = `Olá! Aqui é o Thiago Pinheiro da Agência RAON. 🚀\n\nSegue o seu link exclusivo para cadastrar a sua empresa no nosso sistema RAON Growth OS. Leva apenas 1 minutinho:\n\n🔗 ${registrationLink}\n\nAssim que você preencher, nossa equipe já recebe tudo pronto para iniciar a gestão estratégica do seu Instagram e anúncios!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(invitationMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleSendWhatsAppInvitation = () => {
    const encoded = encodeURIComponent(invitationMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleSubmitManualForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !clientName.trim() || !phone.trim()) {
      alert('Por favor, preencha o nome da empresa, responsável e telefone/WhatsApp.');
      return;
    }

    const docFormatted = document.trim() ? document.trim() : '00.000.000/0000-00';

    addAgencyClient({
      companyName: companyName.trim(),
      clientName: clientName.trim(),
      document: docFormatted,
      phone: phone.trim(),
      email: email.trim() || `contato@${companyName.toLowerCase().replace(/\s+/g, '')}.com.br`,
      contractStartDate: new Date().toISOString().split('T')[0],
      dueDay: Number(dueDay) || 10,
      monthlyValue: Number(monthlyValue) || 500,
      plan,
      paymentStatus: 'pending',
      services,
      responsibleStaffName: 'Thiago Pinheiro (Super Admin)',
      notes: notes.trim() || 'Cadastrado diretamente pelo painel Super Admin RAON.',
    });

    setSuccessToast(`Empresa "${companyName}" cadastrada com sucesso no sistema!`);
    
    // Reset form
    setCompanyName('');
    setClientName('');
    setDocument('');
    setPhone('');
    setEmail('');
    setNotes('');

    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#151C2C] bg-[#080B14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#FF7A18] to-[#FF9F43] flex items-center justify-center text-white shadow-lg shadow-[#FF7A18]/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Cadastrar Novo Cliente / Empresa no Sistema
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF7A18]/20 text-[#FF9F43] border border-[#FF7A18]/30">
                  RAON MATRIZ
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Envie o link para o próprio cliente se cadastrar ou faça o cadastro manual abaixo.
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

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-[#22C55E]/15 border-b border-[#22C55E]/30 text-xs text-[#22C55E] flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#151C2C] bg-[#080B14]/70 px-5 gap-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('link')}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'link'
                ? 'border-[#FF7A18] text-[#FF9F43]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Link de Auto-Cadastro para o Cliente</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-[#FF7A18] text-[#FF9F43]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Cadastrar Manualmente</span>
          </button>
        </div>

        {/* TAB 1: LINK DE AUTO-CADASTRO */}
        {activeTab === 'link' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="p-4 rounded-xl bg-linear-to-r from-[#FF7A18]/15 via-[#101522] to-[#2563EB]/15 border border-[#FF7A18]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#FF9F43] font-bold text-xs uppercase font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Link Direto de Auto-Cadastro (Envie para o Cliente)</span>
              </div>
              <p className="text-xs text-[#E2E8F0] leading-relaxed">
                Você pode copiar o link abaixo e mandar para qualquer pessoa pelo WhatsApp. Ao abrir o link, o cliente acessa uma tela exclusiva da <b>Agência RAON</b> onde ele mesmo preenche o nome da empresa, responsável, WhatsApp e dados cadastrais.
              </p>
            </div>

            {/* Input com o Link e Botão Copiar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                Link de Auto-Cadastro da Empresa:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={registrationLink}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-[#38BDF8] font-mono outline-hidden select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 ${
                    copiedLink
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#FF7A18] hover:bg-[#FF9F43] text-white shadow-md shadow-[#FF7A18]/25'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            </div>

            {/* Mensagem Pronta para WhatsApp */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#22C55E]" />
                  <span>Mensagem Pronta para Enviar no WhatsApp:</span>
                </span>
                <button
                  onClick={handleCopyMessage}
                  className="text-[11px] text-[#38BDF8] hover:underline font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedMessage ? 'Copiada!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-[#CBD5E1] whitespace-pre-line font-mono leading-relaxed">
                {invitationMessage}
              </div>

              <button
                onClick={handleSendWhatsAppInvitation}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#22C55E]/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Abrir WhatsApp e Enviar Convite Agora</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FORMULÁRIO MANUAL */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmitManualForm} className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome da Empresa */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Nome da Empresa / Marca *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: NOVO CLIENTE LTDA"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden uppercase"
                />
              </div>

              {/* Nome do Responsável */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marcos Silva"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden"
                />
              </div>

              {/* Telefone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Telefone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#22C55E] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="(71) 98888-7777"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* CNPJ ou CPF */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1 flex items-center justify-between">
                  <span>CNPJ ou CPF</span>
                  <span className="text-[10px] text-[#94A3B8] font-normal">(ou deixe em branco para zeros)</span>
                </label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={document}
                  onChange={e => setDocument(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden font-mono"
                />
              </div>

              {/* Plano */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Plano da Agência
                </label>
                <select
                  value={plan}
                  onChange={e => setPlan(e.target.value as AgencyPlan)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden font-medium"
                >
                  <option value="Bronze">Plano Bronze (R$ 240 a R$ 300/mês)</option>
                  <option value="Prata">Plano Prata (R$ 450 a R$ 500/mês)</option>
                  <option value="Ouro">Plano Ouro (R$ 500 a R$ 520/mês)</option>
                </select>
              </div>

              {/* Valor Mensal */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Valor da Mensalidade (R$) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#22C55E] absolute left-3 top-2.5" />
                  <input
                    type="number"
                    required
                    value={monthlyValue}
                    onChange={e => setMonthlyValue(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Dia de Vencimento */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Dia do Vencimento da Mensalidade *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#38BDF8] absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={dueDay}
                    onChange={e => setDueDay(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  E-mail de Contato
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="contato@empresa.com.br"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Observações do Contrato / Escopo:
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Foco em gestão de Instagram e anúncios para captação de clientes locais."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#FF7A18] outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/25 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Cadastrar Empresa na RAON</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#080B14] border-t border-[#151C2C] flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Super Admin: <b>Thiago Pinheiro</b> • RAON Matriz</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-white transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
