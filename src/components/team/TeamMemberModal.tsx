import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Check, Users, Phone, Mail, Calendar, 
  Briefcase, DollarSign, Camera, Upload, Trash2, 
  Building2, ShieldCheck, Sparkles, CheckCircle2,
  Image as ImageIcon
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
  'CEO',
  'Líder de Criativos',
  'Administradora',
  'Gestor(a) de Tráfego Pago (Meta & Google Ads)',
  'Social Media & Gestora de Instagram',
  'Designer de Criativos & Redes Sociais',
  'Copywriter & Roteirista de Conteúdo',
  'Head de Growth & Estrategista',
];

const PRESET_AVATARS = [
  {
    name: 'Thiago Pinheiro (Executivo)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mateus Lima (Criativo)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Gabriela Alencar (Administradora)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Corporativo 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Corporativo 2',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  },
];

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { agencyClients } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(initialData);

  const [name, setName] = useState('');
  const [role, setRole] = useState('CEO');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<TeamMember['status']>('active');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [salary, setSalary] = useState<number>(0);
  const [assignedClientNames, setAssignedClientNames] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [notes, setNotes] = useState('');

  // Sync state whenever modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setRole(initialData.role || 'CEO');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setStatus(initialData.status || 'active');
      setStartDate(initialData.startDate || new Date().toISOString().split('T')[0]);
      setSalary(initialData.salary || 0);
      setAssignedClientNames(initialData.assignedClientNames || []);
      setAvatarUrl(initialData.avatarUrl || '');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setRole('CEO');
      setPhone('(71) 98303-2979');
      setEmail('');
      setStatus('active');
      setStartDate(new Date().toISOString().split('T')[0]);
      setSalary(5000);
      setAssignedClientNames([]);
      setAvatarUrl('');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleClient = (clientName: string) => {
    if (assignedClientNames.includes(clientName)) {
      setAssignedClientNames(assignedClientNames.filter(c => c !== clientName));
    } else {
      setAssignedClientNames([...assignedClientNames, clientName]);
    }
  };

  const handleSelectAllClients = () => {
    if (assignedClientNames.length === agencyClients.length) {
      setAssignedClientNames([]);
    } else {
      setAssignedClientNames(agencyClients.map(c => c.companyName));
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
      avatarUrl: avatarUrl.trim() || undefined,
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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {isEditing ? `Editar Colaborador: ${initialData?.name}` : 'Cadastrar Novo Membro na Equipe RAON'}
                </h2>
                <span className="text-[10px] bg-[#38BDF8]/15 text-[#38BDF8] px-2 py-0.5 rounded font-mono font-bold">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Gerencie foto de perfil, telefone, e-mail, admissão, salário mensal e contas atendidas.
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
          
          {/* SEÇÃO 1: FOTO DE PERFIL */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#38BDF8]" />
                Foto de Perfil do Colaborador
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                Upload de arquivo ou link web
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-[#101522] border-2 border-[#38BDF8]/40 shadow-lg overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={name || 'Colaborador'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#2563EB]/40 to-[#38BDF8]/30 flex flex-col items-center justify-center text-[#38BDF8]">
                      {name ? (
                        <span className="text-xl font-bold">
                          {name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                      ) : (
                        <Users className="w-7 h-7 opacity-60" />
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white shadow-md transition cursor-pointer"
                  title="Alterar Foto"
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

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar Foto do Computador</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="px-3 py-1.5 rounded-lg bg-[#101522] hover:bg-[#151C2C] text-[#94A3B8] hover:text-white border border-[#151C2C] text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Colar Link de Foto</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remover</span>
                    </button>
                  )}
                </div>

                {/* URL Input field if toggled */}
                {showUrlField && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto.jpg"
                      value={customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#101522] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          setAvatarUrl(customUrlInput.trim());
                          setCustomUrlInput('');
                          setShowUrlField(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#22C55E] text-black text-xs font-bold transition shrink-0"
                    >
                      Aplicar
                    </button>
                  </div>
                )}

                {/* Quick Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#94A3B8] block mb-1">
                    Fotos sugeridas para a equipe RAON:
                  </span>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    {PRESET_AVATARS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(p.url)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition ${
                          avatarUrl === p.url
                            ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] font-bold'
                            : 'bg-[#101522] border-[#151C2C] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: DADOS PESSOAIS E CARGO */}
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
                  placeholder="Ex: Thiago Pinheiro"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden font-bold"
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
                  placeholder="Ex: CEO, Líder de Criativos, Administradora"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden font-semibold"
                />
              </div>

              {/* Botões rápidos de cargo */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`text-[10px] px-2.5 py-1 rounded-md transition border ${
                      role === r
                        ? 'bg-[#2563EB]/25 text-[#38BDF8] border-[#2563EB] font-bold'
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
                <Phone className="w-4 h-4 text-[#22C55E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: (71) 98303-2979"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden font-mono"
                />
              </div>
            </div>

            {/* E-mail Corporativo */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                E-mail Corporativo *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#38BDF8] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="Ex: thiago@agenciaraon.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Data de Entrada na Agência */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Entrada na Agência (Admissão) *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#FF9F43] absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#38BDF8] outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Salário Mensal (R$) */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Salário Mensal (R$) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#22C55E] absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  placeholder="Ex: 6500"
                  value={salary || ''}
                  onChange={e => setSalary(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-[#22C55E] font-bold focus:border-[#38BDF8] outline-hidden font-mono"
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] mt-1 block">
                Valor mensal pago pela Agência RAON
              </span>
            </div>

            {/* Status na Agência */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Status Atual na Agência
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white focus:border-[#38BDF8] outline-hidden font-medium"
              >
                <option value="active">🟢 Ativo (Em Operação Diária)</option>
                <option value="vacation">🟡 Em Férias / Ausente Temporariamente</option>
                <option value="inactive">⚪ Inativo / Desligado</option>
              </select>
            </div>
          </div>

          {/* SEÇÃO 3: CONTAS QUE ELAS ATENDEM */}
          <div className="pt-3 border-t border-[#151C2C]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FF7A18]" />
                  Contas que Atendem (Clientes da Agência RAON):
                </label>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  Selecione os clientes sob responsabilidade direta deste colaborador:
                </p>
              </div>

              <button
                type="button"
                onClick={handleSelectAllClients}
                className="text-[11px] text-[#38BDF8] hover:underline font-semibold"
              >
                {assignedClientNames.length === agencyClients.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 bg-[#080B14] rounded-xl border border-[#151C2C]">
              {agencyClients.length === 0 ? (
                <div className="p-4 text-xs text-[#94A3B8] col-span-2 text-center">
                  Nenhum cliente da agência disponível.
                </div>
              ) : (
                agencyClients.map(c => {
                  const isChecked = assignedClientNames.includes(c.companyName);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleToggleClient(c.companyName)}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition border cursor-pointer ${
                        isChecked
                          ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white shadow-sm'
                          : 'bg-[#101522] border-[#151C2C] text-[#94A3B8] hover:text-white hover:border-[#151C2C]/80'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-bold truncate text-white">{c.companyName}</div>
                        <div className="text-[10px] text-[#94A3B8] truncate">
                          {c.clientName} • Plano {c.plan} (R$ {c.monthlyValue.toLocaleString('pt-BR')})
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${
                        isChecked ? 'bg-[#38BDF8] border-[#38BDF8] text-black font-bold' : 'border-[#94A3B8]/40'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>Contas selecionadas: <strong className="text-white">{assignedClientNames.length}</strong></span>
              <span>Total de clientes ativos: {agencyClients.length}</span>
            </div>
          </div>

          {/* SEÇÃO 4: OBSERVAÇÕES */}
          <div className="pt-2 border-t border-[#151C2C]">
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Observações, Habilidades & Especialidades
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Responsável pela liderança criativa, revisão de artes e estratégias visuais das contas..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="p-3.5 bg-[#080B14] -mx-5 -mb-5 mt-4 border-t border-[#151C2C] flex items-center justify-between">
            <div className="text-xs text-[#94A3B8] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Acesso restrito ao Super Admin</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#2563EB] to-[#38BDF8] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#2563EB]/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Dados do Colaborador' : 'Cadastrar Colaborador'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
