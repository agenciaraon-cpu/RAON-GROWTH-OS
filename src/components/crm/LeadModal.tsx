import React, { useState } from 'react';
import { X, UserPlus, DollarSign, Check } from 'lucide-react';
import { Lead, LeadStage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Lead, 'id' | 'createdAt'>) => void;
  initialData?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const { currentOrg } = useAuth();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    company: initialData?.company || '',
    city: initialData?.city || 'São Paulo',
    state: initialData?.state || 'SP',
    origin: (initialData?.origin || 'Meta Ads') as Lead['origin'],
    campaignName: initialData?.campaignName || 'Campanha Q4',
    service: initialData?.service || 'Serviço Premium',
    responsible: initialData?.responsible || 'Roberto Lima (SDR)',
    stage: (initialData?.stage || 'novo_lead') as LeadStage,
    potentialValue: initialData?.potentialValue || 25000,
    notes: initialData?.notes || '',
    nextAction: initialData?.nextAction || 'Primeiro contato por WhatsApp',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      organizationId: currentOrg.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[#151C2C] bg-[#080B14] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF7A18]/20 flex items-center justify-center text-[#FF7A18]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Lead' : 'Cadastrar Novo Lead Comercial'}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Entrada direta no CRM do {currentOrg.name}
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Lucas Silva"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="11987654321"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">E-mail</label>
              <input
                type="email"
                placeholder="lucas@exemplo.com.br"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Empresa / Negócio</label>
              <input
                type="text"
                placeholder="Silva Participações"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Canal de Origem</label>
              <select
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              >
                <option value="Meta Ads">Meta Ads (Instagram / Facebook)</option>
                <option value="Google Ads">Google Ads (Pesquisa)</option>
                <option value="WhatsApp">WhatsApp Direto</option>
                <option value="Landing Page">Landing Page RAON</option>
                <option value="TikTok Ads">TikTok Ads</option>
                <option value="Indicação">Indicação de Cliente</option>
                <option value="Orgânico">Orgânico / Busca</option>
              </select>
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Valor Potencial Estimado (R$)</label>
              <input
                type="number"
                value={formData.potentialValue}
                onChange={e => setFormData({ ...formData, potentialValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Estágio Inicial</label>
              <select
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              >
                <option value="novo_lead">NOVO LEAD</option>
                <option value="contato">CONTATO</option>
                <option value="qualificado">QUALIFICADO</option>
                <option value="orcamento">ORÇAMENTO</option>
                <option value="negociacao">NEGOCIAÇÃO</option>
                <option value="ganho">GANHO</option>
                <option value="perdido">PERDIDO</option>
              </select>
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1 font-medium">Responsável Comercial</label>
              <select
                value={formData.responsible}
                onChange={e => setFormData({ ...formData, responsible: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
              >
                <option value="Thiago Pinheiro (CEO)">Thiago Pinheiro (CEO)</option>
                <option value="Mateus Lima (Líder de Criativos)">Mateus Lima (Líder de Criativos)</option>
                <option value="Gabriela Alencar (Administradora)">Gabriela Alencar (Administradora)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1 font-medium">Próxima Ação / Follow-up</label>
            <input
              type="text"
              placeholder="Ex: Ligar às 14h para apresentar proposta de fluxo"
              value={formData.nextAction}
              onChange={e => setFormData({ ...formData, nextAction: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1 font-medium">Observações Iniciais</label>
            <textarea
              rows={2}
              placeholder="Interesses, necessidades e perfil do cliente..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-[#151C2C] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#151C2C] text-xs font-semibold text-[#94A3B8] hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-linear-to-r from-[#FF7A18] to-[#FF9F43] text-white text-xs font-bold transition shadow-md shadow-[#FF7A18]/25"
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Lead no Funil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
