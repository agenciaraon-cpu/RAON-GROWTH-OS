import React, { useState } from 'react';
import { 
  X, Check, Building2, User, Phone, Calendar, 
  DollarSign, Instagram, ShieldCheck, Sparkles 
} from 'lucide-react';
import { AgencyClient, AgencyPlan, PaymentStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface AgencyClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<AgencyClient, 'id' | 'createdAt'>) => void;
  initialData?: AgencyClient | null;
}

const AVAILABLE_SERVICES = [
  'Gestão de Instagram & Feed',
  'Tráfego Pago (Meta Ads)',
  'Tráfego Pago (Google Ads)',
  'Criativos Estáticos para Redes Sociais',
  'Edição de Reels & Vídeos Curtos',
  'Copywriting para Anúncios',
  'Consultoria Estratégica de Vendas',
  'Automação de WhatsApp',
];

export const AgencyClientModal: React.FC<AgencyClientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const { teamMembers } = useData();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    companyName: initialData?.companyName || '',
    document: initialData?.document || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    contractStartDate: initialData?.contractStartDate || new Date().toISOString().split('T')[0],
    dueDay: initialData?.dueDay || 10,
    monthlyValue: initialData?.monthlyValue || 4500,
    plan: (initialData?.plan || 'Prata') as AgencyPlan,
    paymentStatus: (initialData?.paymentStatus || 'paid') as PaymentStatus,
    lastPaymentDate: initialData?.lastPaymentDate || new Date().toISOString().split('T')[0],
    services: initialData?.services || ['Gestão de Instagram & Feed', 'Tráfego Pago (Meta Ads)', 'Criativos Estáticos para Redes Sociais'],
    instagram: initialData?.instagram || '',
    responsibleStaffName: initialData?.responsibleStaffName || (teamMembers[0]?.name || 'Felipe Rocha'),
    notes: initialData?.notes || '',
  });

  if (!isOpen) return null;

  const handleToggleService = (svc: string) => {
    if (formData.services.includes(svc)) {
      setFormData({ ...formData, services: formData.services.filter(s => s !== svc) });
    } else {
      setFormData({ ...formData, services: [...formData.services, svc] });
    }
  };

  const handlePlanChange = (plan: AgencyPlan) => {
    let suggestedValue = formData.monthlyValue;
    if (plan === 'Bronze') suggestedValue = 2800;
    else if (plan === 'Prata') suggestedValue = 5500;
    else if (plan === 'Ouro') suggestedValue = 8900;

    setFormData({
      ...formData,
      plan,
      monthlyValue: suggestedValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#151C2C] bg-[#080B14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#FF7A18] to-[#2563EB] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Cliente da Agência' : 'Cadastrar Novo Cliente da Agência RAON'}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Controle de contrato de marketing, gestão de Instagram, tráfego pago e mensalidade.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Dados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Nome do Cliente / Responsável *</label>
              <input
                type="text"
                required
                placeholder="Ex: Dra. Camila Torres"
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Nome da Empresa / Marca *</label>
              <input
                type="text"
                required
                placeholder="Ex: Torres Dermatologia & Estética"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">CNPJ ou CPF *</label>
              <input
                type="text"
                required
                placeholder="00.000.000/0001-00 ou CPF"
                value={formData.document}
                onChange={e => setFormData({ ...formData, document: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="(11) 99123-8877"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Instagram (@)</label>
              <input
                type="text"
                placeholder="@dracamilatorres"
                value={formData.instagram}
                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">E-mail de Contato</label>
              <input
                type="email"
                placeholder="contato@empresa.com.br"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
          </div>

          {/* Plano & Pagamento */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-3">
            <span className="font-bold text-white text-xs block uppercase tracking-wider text-[#FF7A18]">
              Plano & Condições Financeiras do Contrato
            </span>

            {/* Plano Selector (Bronze, Prata, Ouro) */}
            <div className="grid grid-cols-3 gap-3">
              {(['Bronze', 'Prata', 'Ouro'] as AgencyPlan[]).map(p => {
                const isSelected = formData.plan === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePlanChange(p)}
                    className={`p-3 rounded-xl border text-center transition font-semibold ${
                      isSelected
                        ? p === 'Ouro'
                          ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FBBF24] shadow-md shadow-[#F59E0B]/20'
                          : p === 'Prata'
                          ? 'bg-[#94A3B8]/20 border-[#CBD5E1] text-[#F8FAFC] shadow-md shadow-[#94A3B8]/20'
                          : 'bg-[#B45309]/20 border-[#D97706] text-[#F59E0B] shadow-md shadow-[#B45309]/20'
                        : 'bg-[#101522] border-[#151C2C] text-[#94A3B8] hover:text-white hover:border-[#38BDF8]/40'
                    }`}
                  >
                    <div className="text-xs uppercase font-extrabold tracking-wider">Plano {p}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">
                      {p === 'Bronze' ? 'R$ 2.800/mês' : p === 'Prata' ? 'R$ 5.500/mês' : 'R$ 8.900/mês'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Valor Mensal (R$) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyValue}
                  onChange={e => setFormData({ ...formData, monthlyValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Dia do Vencimento *</label>
                <select
                  value={formData.dueDay}
                  onChange={e => setFormData({ ...formData, dueDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono font-bold"
                >
                  <option value={1}>Dia 01</option>
                  <option value={5}>Dia 05</option>
                  <option value={10}>Dia 10</option>
                  <option value={15}>Dia 15</option>
                  <option value={20}>Dia 20</option>
                  <option value={25}>Dia 25</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Status do Pagamento</label>
                <select
                  value={formData.paymentStatus}
                  onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-bold"
                >
                  <option value="paid">Pago (Em Dia)</option>
                  <option value="pending">Pendente (A Vencer)</option>
                  <option value="overdue">Atrasado (Inadimplente)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Data de Início do Contrato</label>
                <input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={e => setFormData({ ...formData, contractStartDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Membro Responsável da Agência</label>
                <select
                  value={formData.responsibleStaffName}
                  onChange={e => setFormData({ ...formData, responsibleStaffName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101522] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name}>{m.name} ({m.role.split(' ')[0]})</option>
                  ))}
                  <option value="Equipe Geral RAON">Equipe Geral RAON</option>
                </select>
              </div>
            </div>
          </div>

          {/* Serviços Inclusos */}
          <div>
            <label className="block text-[#94A3B8] mb-1.5 font-medium">
              Serviços Contratados (Gestão de Instagram, Tráfego, Criativos):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_SERVICES.map(svc => {
                const isChecked = formData.services.includes(svc);
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => handleToggleService(svc)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                      isChecked
                        ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white'
                        : 'bg-[#080B14] border-[#151C2C] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>{svc}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-[#38BDF8]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-[#94A3B8] mb-1 font-medium">Observações Internas do Cliente</label>
            <textarea
              rows={2}
              placeholder="Ex: Cliente prefere aprovações de criativos às terças-feiras..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-[#151C2C] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#151C2C] text-[#94A3B8] hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] text-white font-bold transition shadow-md shadow-[#FF7A18]/25"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente da Agência'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
