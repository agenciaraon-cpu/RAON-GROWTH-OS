import React, { useRef } from 'react';
import { 
  X, Phone, Mail, Calendar, Briefcase, DollarSign, 
  Building2, Camera, Upload, Trash2, Edit, CheckCircle2, 
  Clock, Shield, ArrowUpRight, MessageSquare 
} from 'lucide-react';
import { TeamMember, AgencyClient } from '../../types';
import { useData } from '../../context/DataContext';

interface TeamMemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onEdit: (member: TeamMember) => void;
  onUpdateAvatar: (memberId: string, avatarUrl: string | undefined) => void;
}

export const TeamMemberProfileModal: React.FC<TeamMemberProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  onEdit,
  onUpdateAvatar,
}) => {
  const { agencyClients } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !member) return null;

  // Calculate tenure
  const calculateTenure = (startDateStr: string) => {
    try {
      const start = new Date(startDateStr);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);

      if (years > 0) {
        return `${years} ano${years > 1 ? 's' : ''} e ${months} m${months === 1 ? 'ês' : 'eses'}`;
      }
      if (months > 0) {
        return `${months} m${months === 1 ? 'ês' : 'eses'} (${diffDays} dias)`;
      }
      return `${diffDays} dias na agência`;
    } catch {
      return 'Data não definida';
    }
  };

  const cleanPhone = member.phone ? member.phone.replace(/\D/g, '') : '';

  const handleWhatsAppContact = () => {
    if (!cleanPhone) return;
    const msg = encodeURIComponent(`Olá ${member.name}, tudo bem? Aqui é da coordenação da Agência RAON!`);
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateAvatar(member.id, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onUpdateAvatar(member.id, undefined);
  };

  // Find assigned client objects
  const assignedClientsList = agencyClients.filter(c => 
    member.assignedClientNames?.includes(c.companyName)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Cover Banner */}
        <div className="relative h-28 bg-linear-to-r from-[#2563EB]/40 via-[#1D4ED8]/30 to-[#38BDF8]/40 border-b border-[#151C2C] p-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#38BDF8]" />
              PERFIL DO COLABORADOR — RAON
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white bg-black/40 hover:bg-black/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content with Avatar Overlay */}
        <div className="px-6 pb-6 pt-0 flex-1 overflow-y-auto">
          {/* Avatar and Main Info row */}
          <div className="relative -mt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-5 border-b border-[#151C2C]">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Avatar with Camera Overlay */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-[#080B14] border-3 border-[#101522] shadow-xl overflow-hidden flex items-center justify-center">
                  {member.avatarUrl ? (
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                </div>

                {/* Quick Photo Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Alterar foto de perfil"
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-[#2563EB] hover:bg-[#38BDF8] text-white shadow-lg transition border border-white/20 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-extrabold text-white">
                    {member.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    member.status === 'active' 
                      ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
                      : member.status === 'vacation'
                      ? 'bg-[#FF9F43]/15 text-[#FF9F43] border-[#FF9F43]/30'
                      : 'bg-[#94A3B8]/15 text-[#94A3B8] border-[#94A3B8]/30'
                  }`}>
                    {member.status === 'active' ? '🟢 Ativo' : member.status === 'vacation' ? '🟡 Férias' : '⚪ Inativo'}
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="text-sm font-semibold text-[#38BDF8] flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {member.role}
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                    Entrada: {new Date(member.startDate).toLocaleDateString('pt-BR')}
                  </span>
                  <span>•</span>
                  <span className="text-[#22C55E] font-medium">
                    {calculateTenure(member.startDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right Action: Edit */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(member);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#38BDF8] hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-[#2563EB]/25"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editar Dados</span>
              </button>
            </div>
          </div>

          {/* Quick Photo Actions bar */}
          <div className="my-4 p-3 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Camera className="w-4 h-4 text-[#38BDF8]" />
              <span>Foto de perfil do colaborador:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-[#2563EB]/20 hover:bg-[#2563EB]/30 text-[#38BDF8] border border-[#2563EB]/40 transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" /> Carregar Foto
              </button>
              {member.avatarUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remover
                </button>
              )}
            </div>
          </div>

          {/* Grid of Details: Contato, Salário, Entrada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* Telefone / WhatsApp */}
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Número de Telefone</span>
                <div className="text-xs text-white font-mono font-bold mt-0.5">{member.phone || 'Não informado'}</div>
              </div>
              {member.phone && (
                <button
                  onClick={handleWhatsAppContact}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22C55E]/15 hover:bg-[#22C55E] text-[#22C55E] hover:text-white transition text-xs font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              )}
            </div>

            {/* Email Corporativo */}
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">E-mail Corporativo</span>
                <div className="text-xs text-white font-medium mt-0.5 truncate max-w-[200px]">
                  {member.email || 'Não informado'}
                </div>
              </div>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="p-1.5 rounded-lg bg-[#38BDF8]/15 hover:bg-[#38BDF8]/30 text-[#38BDF8] transition"
                  title="Enviar e-mail"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Entrada na Agência */}
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Entrada na Agência</span>
              <div className="text-xs text-white font-mono font-bold mt-0.5">
                {new Date(member.startDate).toLocaleDateString('pt-BR')}
              </div>
              <span className="text-[10px] text-[#22C55E]">
                {calculateTenure(member.startDate)}
              </span>
            </div>

            {/* Salário Mensal (Super Admin) */}
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Salário Mensal</span>
              <div className="text-sm text-[#22C55E] font-mono font-extrabold mt-0.5">
                {member.salary 
                  ? `R$ ${member.salary.toLocaleString('pt-BR')}` 
                  : 'R$ 0,00'}
              </div>
              <span className="text-[10px] text-[#94A3B8]">
                Folha de pagamento RAON
              </span>
            </div>
          </div>

          {/* Contas que Atendem */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FF7A18]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Contas da Agência Atendidas ({member.assignedClientNames?.length || 0})
                </h3>
              </div>
              <span className="text-[10px] text-[#94A3B8]">
                Projetos & Campanhas Ativas
              </span>
            </div>

            {member.assignedClientNames && member.assignedClientNames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {member.assignedClientNames.map(clientName => {
                  const clientObj = agencyClients.find(c => c.companyName === clientName);
                  return (
                    <div 
                      key={clientName}
                      className="p-2.5 rounded-lg bg-[#101522] border border-[#151C2C] flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-bold text-white truncate">{clientName}</div>
                        {clientObj && (
                          <div className="text-[10px] text-[#94A3B8] truncate">
                            {clientObj.clientName} • Plano {clientObj.plan}
                          </div>
                        )}
                      </div>
                      {clientObj && (
                        <span className="text-[11px] font-mono font-bold text-[#22C55E] shrink-0">
                          R$ {clientObj.monthlyValue.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] italic py-2 text-center">
                Nenhuma conta da agência atribuída a este colaborador no momento.
              </p>
            )}
          </div>

          {/* Observações */}
          {member.notes && (
            <div className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block mb-1">
                Especialidade & Observações Internas
              </span>
              <p className="text-xs text-white/90 leading-relaxed italic">
                "{member.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#080B14] border-t border-[#151C2C] flex items-center justify-between">
          <div className="text-xs text-[#94A3B8]">
            ID: <span className="font-mono text-white/70">{member.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(member);
              }}
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editar Informações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
