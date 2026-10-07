import React, { useState } from 'react';
import { 
  X, Check, Users, Phone, Mail, Calendar, 
  Briefcase, DollarSign, FileText, CheckCircle2 
} from 'lucide-react';
import { TeamMember } from '../../types';
import { useData } from '../../context/DataContext';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  initialData?: TeamMember | null;
}

const COMMON_ROLES = [
  'Gestor(a) de Tráfego Pago (Meta & Google Ads)',
  'Social Media & Gestora de Instagram',
  'Designer de Criativos & Redes Sociais',
  'Editor(a) de Vídeos & Reels Dinâmicos',
  'Copywriter & Roteirista de Conteúdo',
  'Head de Growth & Estrategista Chefe',
  'Atendimento / Gerente de Contas (CS)',
  'Web Designer & Landing Pages',
];

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { agencyClients } = useData();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || 'Gestor(a) de Tráfego Pago (Meta & Google Ads)');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [status, setStatus] = useState<TeamMember['status']>(initialData?.status || 'active');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [salary, setSalary] = useState<number>(initialData?.salary || 0);
  const [assignedClientNames, setAssignedClientNames] = useState<string[]>(initialData?.assignedClientNames || []);
  const [notes, setNotes] = useState(initialData?.notes || '');

  if (!isOpen) return null;

  const handleToggleClient = (clientName: string) => {
    if (assignedClientNames.includes(clientName)) {
      setAssignedClientNames(assignedClientNames.filter(c => c !== clientName));
    } else {
      setAssignedClientNames([...assignedClientNames, clientName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status,
      startDate,
      salary: Number(salary) || undefined,
      assignedClientNames,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#151C2C] bg-[#080B14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center text-white shadow-md">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Membro da Equipe' : 'Cadastrar Novo Membro da Equipe RAON'}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Cadastre profissionais da agência, defina função, contato e contas atribuídas.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Nome do Colaborador *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Duarte"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
                />
              </div>
            </div>

            {/* Função / Cargo */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Função / Cargo na Agência *
              </label>
              <div className="relative mb-2">
                <Briefcase className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Gestora de Tráfego Pago (Meta & Google Ads)"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
                />
              </div>

              {/* Sugestões de Cargos Rápidos */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`text-[10px] px-2 py-1 rounded transition border ${
                      role === r
                        ? 'bg-[#2563EB]/25 text-[#38BDF8] border-[#2563EB]'
                        : 'bg-[#080B14] text-[#94A3B8] border-[#151C2C] hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Número de Telefone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Número de Telefone / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: (11) 98765-4321"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
                />
              </div>
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="Ex: mariana@agenciaraon.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Status na Agência
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#38BDF8] outline-hidden font-medium"
              >
                <option value="active">🟢 Ativo (Em Operação)</option>
                <option value="vacation">🟡 Em Férias / Ausente</option>
                <option value="inactive">⚪ Inativo / Desligado</option>
              </select>
            </div>

            {/* Data de Início */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Data de Início
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>
            </div>

            {/* Salário / Remuneração (Opcional) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Remuneração / Salário Mensal (R$)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Ex: 5500"
                  value={salary || ''}
                  onChange={e => setSalary(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#38BDF8] outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Clientes da Agência Atribuídos */}
          <div className="pt-2 border-t border-[#151C2C]">
            <label className="block text-xs font-semibold text-white mb-2">
              Clientes da Agência Atribuídos a este Colaborador:
            </label>
            <p className="text-[11px] text-[#94A3B8] mb-2.5">
              Selecione quais clientes da agência (Instagram, tráfego, criativos) estão sob a responsabilidade deste membro:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-[#080B14] rounded-xl border border-[#151C2C]">
              {agencyClients.length === 0 ? (
                <div className="p-3 text-xs text-[#94A3B8] col-span-2 text-center">
                  Nenhum cliente da agência cadastrado ainda.
                </div>
              ) : (
                agencyClients.map(c => {
                  const isChecked = assignedClientNames.includes(c.companyName);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleToggleClient(c.companyName)}
                      className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition border ${
                        isChecked
                          ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white'
                          : 'bg-[#101522] border-[#151C2C] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{c.companyName}</div>
                        <div className="text-[10px] text-[#94A3B8] truncate">{c.clientName} ({c.plan})</div>
                      </div>
                      <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${
                        isChecked ? 'bg-[#38BDF8] border-[#38BDF8] text-black' : 'border-[#94A3B8]/40'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Observações & Especialidades
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Especialista em campanhas de mensagens e criativos em carrossel..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="p-3 bg-[#080B14] -mx-5 -mb-5 mt-4 border-t border-[#151C2C] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#38BDF8] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#2563EB]/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Membro da Equipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
