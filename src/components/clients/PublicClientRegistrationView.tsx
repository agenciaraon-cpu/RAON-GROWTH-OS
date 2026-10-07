import React, { useState } from 'react';
import { 
  Building2, User, Phone, Mail, Instagram, CheckCircle2, 
  Send, Sparkles, ShieldCheck, ArrowRight, Check
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AgencyPlan } from '../../types';

interface PublicClientRegistrationViewProps {
  onFinish?: () => void;
}

export const PublicClientRegistrationView: React.FC<PublicClientRegistrationViewProps> = ({
  onFinish,
}) => {
  const { addAgencyClient } = useData();

  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [plan, setPlan] = useState<AgencyPlan>('Prata');
  const [segment, setSegment] = useState('Serviços');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !clientName.trim() || !phone.trim()) {
      alert('Por favor, preencha o nome da sua empresa, seu nome e seu WhatsApp.');
      return;
    }

    const docFormatted = document.trim() ? document.trim() : '00.000.000/0000-00';
    const planValue = plan === 'Bronze' ? 300 : plan === 'Prata' ? 500 : 520;

    addAgencyClient({
      companyName: companyName.trim().toUpperCase(),
      clientName: clientName.trim(),
      document: docFormatted,
      phone: phone.trim(),
      email: email.trim() || `contato@${companyName.toLowerCase().replace(/\s+/g, '')}.com.br`,
      contractStartDate: new Date().toISOString().split('T')[0],
      dueDay: 10,
      monthlyValue: planValue,
      plan,
      paymentStatus: 'pending',
      services: ['Gestão de Instagram', 'Tráfego Pago', 'Criativos para Redes Sociais'],
      instagram: instagram.trim() ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : undefined,
      responsibleStaffName: 'Thiago Pinheiro (Super Admin)',
      notes: `Auto-cadastro realizado pelo cliente via link público. Segmento: ${segment}.`,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-4">
        <div className="w-full max-w-lg p-8 rounded-3xl bg-[#101522] border border-[#22C55E]/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#22C55E]">
              CADASTRO CONCLUÍDO COM SUCESSO!
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              Bem-vindo(a) à Agência RAON!
            </h1>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Os dados da empresa <b>{companyName}</b> foram registrados com sucesso no sistema. O <b>Thiago Pinheiro</b> e a equipe da RAON já receberam sua solicitação!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080B14] border border-[#151C2C] text-xs space-y-2 text-left">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Empresa:</span>
              <span className="text-white font-bold">{companyName}</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Responsável:</span>
              <span className="text-white">{clientName}</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>WhatsApp:</span>
              <span className="text-[#22C55E] font-mono">{phone}</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Plano Selecionado:</span>
              <span className="text-[#FF9F43] font-bold">Plano {plan}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://api.whatsapp.com/send?phone=5571983032979&text=${encodeURIComponent(`Olá Thiago! Concluí o cadastro da minha empresa ${companyName} no RAON Growth OS.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-[#22C55E] to-[#16A34A] text-white text-xs font-bold transition shadow-lg shadow-[#22C55E]/25 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Falar com Thiago no WhatsApp</span>
            </a>

            {onFinish && (
              <button
                onClick={onFinish}
                className="py-3 px-4 rounded-xl bg-[#151C2C] hover:bg-[#1E293B] text-white text-xs font-semibold transition"
              >
                Acessar Painel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B14] flex flex-col justify-center items-center p-4 py-8">
      {/* Brand Header */}
      <div className="w-full max-w-xl text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A18]/15 border border-[#FF7A18]/30 text-xs font-mono font-bold text-[#FF9F43]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AGÊNCIA RAON • GROWTH OS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cadastro da Sua Empresa
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
          Preencha os dados abaixo para iniciar a gestão estratégica de Instagram, tráfego pago e criativos com a agência.
        </p>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-xl bg-[#101522] border border-[#151C2C] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#FF7A18] via-[#38BDF8] to-[#22C55E]" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome da Empresa */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#FF7A18]" />
                <span>Nome da Sua Empresa / Marca *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: SILVA ADVOCACIA, LOJA MODA, RESTAURANTE..."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#FF7A18] outline-hidden uppercase"
              />
            </div>

            {/* Nome do Responsável */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Seu Nome (Responsável) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Seu nome completo"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#FF7A18] outline-hidden"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>WhatsApp / Celular com DDD *</span>
              </label>
              <input
                type="text"
                required
                placeholder="(71) 99999-8888"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#FF7A18] outline-hidden font-mono"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-[#FF7A18]" />
                <span>Instagram da Empresa (Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="@suaempresa"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#FF7A18] outline-hidden"
              />
            </div>

            {/* CNPJ ou CPF */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>CNPJ ou CPF (Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                value={document}
                onChange={e => setDocument(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#FF7A18] outline-hidden font-mono"
              />
            </div>

            {/* E-mail */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>E-mail de Contato</span>
              </label>
              <input
                type="email"
                placeholder="seuemail@empresa.com.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#FF7A18] outline-hidden"
              />
            </div>

            {/* Plano de Marketing Contratado */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-white mb-1.5">
                Plano de Atendimento Selecionado:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Bronze', 'Prata', 'Ouro'] as AgencyPlan[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`p-3 rounded-xl border text-center transition ${
                      plan === p
                        ? 'bg-[#FF7A18]/15 border-[#FF7A18] text-white shadow-md'
                        : 'bg-[#080B14] border-[#151C2C] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Plano {p}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      {p === 'Bronze' ? 'R$ 240-300' : p === 'Prata' ? 'R$ 450-500' : 'R$ 500-520'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-xl shadow-[#FF7A18]/25 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Concluir Cadastro da Minha Empresa</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-[#94A3B8]">
              Seus dados estão protegidos e serão enviados diretamente para a <b>Agência RAON (Thiago Pinheiro)</b>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
