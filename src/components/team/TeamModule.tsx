import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Phone, Mail, 
  Briefcase, Calendar, CheckCircle2, Clock, 
  Trash2, Edit, MessageSquare, ShieldCheck, 
  ArrowUpRight, Building2, Sparkles, AlertCircle,
  Eye, Camera, ExternalLink, UserCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TeamMember } from '../../types';
import { TeamMemberModal } from './TeamMemberModal';
import { TeamMemberProfileModal } from './TeamMemberProfileModal';

export const TeamModule: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingProfileMember, setViewingProfileMember] = useState<TeamMember | null>(null);

  // Filter team members
  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.assignedClientNames && m.assignedClientNames.some(c => c.toLowerCase().includes(search.toLowerCase())));

    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;
    const matchesRole = selectedRole === 'all' || m.role.toLowerCase().includes(selectedRole.toLowerCase());

    return matchesSearch && matchesStatus && matchesRole;
  });

  // KPI Calculations
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const vacationMembers = teamMembers.filter(m => m.status === 'vacation').length;
  const totalSalaries = teamMembers.reduce((sum, m) => sum + (m.salary || 0), 0);
  
  // Total assigned accounts count
  const allAssignedAccountsCount = teamMembers.reduce((sum, m) => sum + (m.assignedClientNames?.length || 0), 0);
  const avgAccountsPerMember = totalMembers > 0 ? (allAssignedAccountsCount / totalMembers).toFixed(1) : '0';

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setIsEditModalOpen(true);
  };

  const handleOpenProfile = (member: TeamMember) => {
    setViewingProfileMember(member);
    setIsProfileModalOpen(true);
  };

  const handleSave = (data: Omit<TeamMember, 'id' | 'createdAt'>) => {
    if (editingMember) {
      updateTeamMember(editingMember.id, data);
      // Also update viewingProfileMember if it's the one open
      if (viewingProfileMember && viewingProfileMember.id === editingMember.id) {
        setViewingProfileMember({
          ...viewingProfileMember,
          ...data,
        });
      }
    } else {
      addTeamMember(data);
    }
  };

  const handleUpdateAvatar = (memberId: string, avatarUrl: string | undefined) => {
    updateTeamMember(memberId, { avatarUrl });
    if (viewingProfileMember && viewingProfileMember.id === memberId) {
      setViewingProfileMember({
        ...viewingProfileMember,
        avatarUrl,
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja realmente remover o colaborador "${name}" da equipe RAON?`)) {
      deleteTeamMember(id);
      if (viewingProfileMember && viewingProfileMember.id === id) {
        setIsProfileModalOpen(false);
      }
    }
  };

  const handleWhatsAppContact = (member: TeamMember) => {
    const cleanPhone = member.phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá ${member.name}, tudo bem? Aqui é da coordenação da Agência RAON!`);
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    if (status === 'active') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Ativo
        </span>
      );
    }
    if (status === 'vacation') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/30 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Férias
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#94A3B8]/15 text-[#94A3B8] border border-[#94A3B8]/30 flex items-center gap-1">
        Inativo
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#101522] via-[#151C2C] to-[#101522] border border-[#2563EB]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/15 px-2.5 py-0.5 rounded border border-[#38BDF8]/30">
              PAINEL SUPER ADMIN — EQUIPE RAON
            </span>
            <span className="text-xs text-[#94A3B8]">Gestão de Pessoas & Operação</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Equipe da Agência RAON
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl mt-1">
            Super Admin com controle total para editar foto de perfil, telefone, e-mail, admissão na agência, salário mensal e contas atendidas de cada colaborador.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#2563EB] to-[#38BDF8] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#2563EB]/25 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Colaborador</span>
        </button>
      </div>

      {/* DASHBOARD EXCLUSIVO DA EQUIPE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Membros */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Total Colaboradores</span>
          <div className="text-2xl font-bold text-white mt-1">{totalMembers}</div>
          <span className="text-[10px] text-[#22C55E] flex items-center gap-0.5 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> Time RAON
          </span>
        </div>

        {/* Membros Ativos */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#22C55E]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Em Operação Ativa</span>
          <div className="text-2xl font-bold text-[#22C55E] mt-1">{activeMembers}</div>
          <span className="text-[10px] text-[#94A3B8]">
            {vacationMembers > 0 ? `${vacationMembers} de férias` : '100% disponíveis'}
          </span>
        </div>

        {/* Investimento em Folha */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Folha Mensal</span>
          <div className="text-2xl font-bold text-[#38BDF8] mt-1 font-mono">
            R$ {totalSalaries.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono">
            Salários da agência
          </span>
        </div>

        {/* Média de Contas */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#FF7A18]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Média de Contas</span>
          <div className="text-2xl font-bold text-[#FF9F43] mt-1 font-mono">
            {avgAccountsPerMember}
          </div>
          <span className="text-[10px] text-[#94A3B8]">Por colaborador</span>
        </div>

        {/* Alocação de Contas */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#2563EB]/40 transition col-span-2 sm:col-span-4 lg:col-span-1">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Atribuições Ativas</span>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {allAssignedAccountsCount}
          </div>
          <span className="text-[10px] text-[#22C55E] font-medium">Contas atendidas</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101522] p-3 rounded-xl border border-[#151C2C]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, função, telefone, e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden font-medium"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="vacation">Férias</option>
            <option value="inactive">Inativo</option>
          </select>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden font-medium"
          >
            <option value="all">Todas as Funções</option>
            <option value="ceo">CEO</option>
            <option value="criativos">Líder de Criativos</option>
            <option value="administradora">Administradora</option>
          </select>
        </div>
      </div>

      {/* Lista / Grid de Membros da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#101522] border border-[#151C2C] rounded-2xl">
            <Users className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Nenhum colaborador encontrado</h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
              Ajuste seus filtros de busca ou cadastre um novo membro para a equipe da agência RAON.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#38BDF8] text-white text-xs font-bold transition"
            >
              Cadastrar Colaborador
            </button>
          </div>
        ) : (
          filteredMembers.map(member => {
            return (
              <div 
                key={member.id}
                className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Card Header: Avatar com foto real, Nome, Cargo & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Image with Click to view profile */}
                      <button
                        type="button"
                        onClick={() => handleOpenProfile(member)}
                        className="w-14 h-14 rounded-2xl bg-[#080B14] border-2 border-[#38BDF8]/40 overflow-hidden flex items-center justify-center shrink-0 shadow-md group/avatar hover:scale-105 transition cursor-pointer relative"
                        title="Ver Perfil Completo & Foto"
                      >
                        {member.avatarUrl ? (
                          <img 
                            src={member.avatarUrl} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center text-base font-bold text-white">
                            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </button>

                      <div className="truncate">
                        <button
                          type="button"
                          onClick={() => handleOpenProfile(member)}
                          className="text-left font-bold text-white hover:text-[#38BDF8] transition text-sm truncate block"
                        >
                          {member.name}
                        </button>
                        <p className="text-xs text-[#FF9F43] font-semibold flex items-center gap-1 mt-0.5 truncate">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{member.role}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(member.status)}
                    </div>
                  </div>

                  {/* Informações de Contato, Entrada e Salário */}
                  <div className="mt-4 pt-3 border-t border-[#151C2C] space-y-2 text-xs">
                    {/* Número de Telefone / WhatsApp */}
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>Número / WhatsApp:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-white font-medium">{member.phone}</span>
                        {member.phone && (
                          <button
                            onClick={() => handleWhatsAppContact(member)}
                            title="Conversar no WhatsApp"
                            className="p-1 rounded bg-[#22C55E]/15 hover:bg-[#22C55E] text-[#22C55E] hover:text-white transition"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* E-mail */}
                    {member.email && (
                      <div className="flex items-center justify-between text-[#94A3B8]">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>E-mail:</span>
                        </span>
                        <span className="text-white truncate max-w-[170px] font-mono">{member.email}</span>
                      </div>
                    )}

                    {/* Data de Entrada na Agência */}
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF9F43]" />
                        <span>Entrada na agência:</span>
                      </span>
                      <span className="text-white font-mono font-medium">
                        {new Date(member.startDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Salário Mensal */}
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="flex items-center gap-1.5">
                        <span>Salário mensal:</span>
                      </span>
                      <span className="text-[#22C55E] font-mono font-bold">
                        {member.salary ? `R$ ${member.salary.toLocaleString('pt-BR')}` : 'R$ 0,00'}
                      </span>
                    </div>
                  </div>

                  {/* Contas que Atendem */}
                  <div className="mt-4 pt-3 border-t border-[#151C2C]">
                    <div className="text-[11px] font-semibold text-[#94A3B8] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#FF7A18]" />
                        <span>Contas Atendidas ({member.assignedClientNames?.length || 0}):</span>
                      </span>
                    </div>

                    {member.assignedClientNames && member.assignedClientNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {member.assignedClientNames.map(clientName => (
                          <span 
                            key={clientName}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#080B14] border border-[#2563EB]/30 text-[#38BDF8] font-medium"
                          >
                            {clientName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#94A3B8] italic">
                        Nenhuma conta atribuída atualmente.
                      </p>
                    )}
                  </div>

                  {/* Observações */}
                  {member.notes && (
                    <p className="mt-3 text-[11px] text-[#94A3B8] bg-[#080B14] p-2 rounded-lg border border-[#151C2C] italic">
                      "{member.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Actions: Ver Perfil, Editar Dados, WhatsApp, Remover */}
                <div className="mt-5 pt-3 border-t border-[#151C2C] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProfile(member)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#38BDF8] hover:underline cursor-pointer"
                      title="Ver perfil completo com foto grande"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Ver Perfil</span>
                    </button>

                    <button
                      onClick={() => handleWhatsAppContact(member)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#22C55E] hover:underline ml-2 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#151C2C] transition cursor-pointer"
                      title="Editar dados (Super Admin)"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#151C2C] transition cursor-pointer"
                      title="Remover membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Perfil Detalhado do Colaborador (com visualização de foto grande e troca rápida de foto) */}
      <TeamMemberProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        member={viewingProfileMember}
        onEdit={(member) => handleOpenEdit(member)}
        onUpdateAvatar={handleUpdateAvatar}
      />

      {/* Modal de Edição Completa dos Dados do Colaborador (Super Admin) */}
      <TeamMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={editingMember}
      />
    </div>
  );
};
