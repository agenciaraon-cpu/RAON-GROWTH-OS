import React, { useState } from 'react';
import { 
  Users, UserPlus, Shield, ShieldCheck, Mail, 
  Trash2, Edit, Check, AlertCircle, CheckCircle2, 
  Clock, X, ArrowRight, Lock, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleCode, TenantMember } from '../../types';

const ROLES_INFO: Record<RoleCode, { name: string; desc: string; badgeColor: string }> = {
  owner: {
    name: 'Proprietário',
    desc: 'Controle total da empresa, dados comerciais, finanças e convites de equipe.',
    badgeColor: 'bg-[#345CF3]/15 text-[#345CF3] border-[#345CF3]/30',
  },
  manager: {
    name: 'Gerente',
    desc: 'Supervisão de operações diárias, frente de caixa, relatórios e equipe.',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  cashier: {
    name: 'Operador de Caixa',
    desc: 'Abertura/fechamento do PDV, registro de pedidos e recebimentos.',
    badgeColor: 'bg-[#17B897]/15 text-[#17B897] border-[#17B897]/30',
  },
  sales: {
    name: 'Vendedor',
    desc: 'Lançamento de vendas, orçamentos, consulta de preços e clientes.',
    badgeColor: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30',
  },
  stock: {
    name: 'Estoquista',
    desc: 'Conferência física, entrada de mercadorias e inventário.',
    badgeColor: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
  },
  financial: {
    name: 'Financeiro',
    desc: 'Contas a pagar/receber, conciliação e relatórios financeiros.',
    badgeColor: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  },
};

export const TeamManagementView: React.FC = () => {
  const { 
    currentUser, 
    currentTenant, 
    tenantMembers, 
    invitations, 
    inviteMember, 
    updateMemberRole, 
    removeMember, 
    hasRole 
  } = useAuth();

  const isAuthorized = hasRole(['owner', 'manager']);

  // Modal State for Invite
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<RoleCode>('sales');
  
  // Edit Role Modal State
  const [editingMember, setEditingMember] = useState<TenantMember | null>(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleCode>('sales');

  // Feedback messages
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!inviteEmail.trim()) {
      setFeedback({ type: 'error', text: 'Informe um e-mail válido para o convite.' });
      return;
    }

    setIsSubmitting(true);
    const res = await inviteMember(inviteEmail.trim(), inviteRole);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', text: `Convite enviado para ${inviteEmail}. O colaborador já está registrado na lista.` });
      setInviteEmail('');
      setIsInviteModalOpen(false);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', text: res.error || 'Erro ao enviar convite.' });
    }
  };

  const handleOpenEdit = (member: TenantMember) => {
    setEditingMember(member);
    setSelectedRoleForEdit(member.roleCode);
  };

  const handleSaveRole = async () => {
    if (!editingMember) return;
    setFeedback(null);

    const res = await updateMemberRole(editingMember.id, selectedRoleForEdit);
    if (res.success) {
      setFeedback({ type: 'success', text: `Papel de ${editingMember.userName} atualizado para ${ROLES_INFO[selectedRoleForEdit].name}.` });
      setEditingMember(null);
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', text: res.error || 'Erro ao alterar papel.' });
    }
  };

  const handleRemove = async (memberId: string, name: string) => {
    if (!confirm(`Deseja realmente remover o colaborador "${name}" desta empresa?`)) return;

    setFeedback(null);
    const res = await removeMember(memberId);
    if (res.success) {
      setFeedback({ type: 'success', text: `Colaborador "${name}" removido da empresa com sucesso.` });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', text: res.error || 'Erro ao remover colaborador.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#101A38] to-[#0B1225] text-white border border-[#345CF3]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/15 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30">
              SEGURANÇA & ACESSOS
            </span>
            <span className="text-xs text-slate-400">
              Multi-Tenant RBAC
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Equipe & Permissões da Empresa
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Convide funcionários por e-mail e defina papéis específicos: Proprietário, Gerente, Operador de Caixa, Vendedor, Estoquista e Financeiro.
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-[#345CF3] to-[#8065E9] hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-[#345CF3]/25 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Convidar Funcionário</span>
          </button>
        )}
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2 animate-in fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Roles Legend / Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(ROLES_INFO) as RoleCode[]).map(roleKey => {
          const role = ROLES_INFO[roleKey];
          const membersWithRole = tenantMembers.filter(m => m.roleCode === roleKey).length;
          return (
            <div key={roleKey} className="p-3.5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border block w-fit mb-1.5 ${role.badgeColor}`}>
                {role.name}
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {membersWithRole}
              </div>
              <span className="text-[10px] text-slate-400 block truncate" title={role.desc}>
                {membersWithRole === 1 ? 'colaborador' : 'colaboradores'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Members List Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Colaboradores Cadastrados ({tenantMembers.length})
            </h2>
            <p className="text-xs text-slate-400">
              Usuários com acesso concedido a {currentTenant?.name}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Colaborador</th>
                <th className="py-3 px-3">Papel / Função</th>
                <th className="py-3 px-3">Contato</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {tenantMembers.map(member => {
                const roleInfo = ROLES_INFO[member.roleCode] || ROLES_INFO.sales;
                const isCurrentUser = member.userId === currentUser?.id;

                return (
                  <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition">
                    {/* User */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#345CF3] to-[#8065E9] overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.userName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{member.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-white block truncate">
                            {member.userName} {isCurrentUser && <span className="text-[10px] text-[#345CF3] font-normal">(Você)</span>}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {member.userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleInfo.badgeColor}`}>
                        {roleInfo.name}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-mono">
                      {member.userPhone || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {member.status === 'active' ? 'Ativo' : 'Convite Enviado'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      {isAuthorized ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#345CF3] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Alterar papel"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRemove(member.id, member.userName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                            title="Remover colaborador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Somente leitura</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Invite Member */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Convidar Novo Funcionário
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    O colaborador terá acesso apenas a esta empresa.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  E-mail do Funcionário *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="funcionario@gmail.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Papel de Acesso no RAON System *
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as RoleCode)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-[#345CF3] outline-hidden font-bold"
                >
                  <option value="manager">Gerente (Supervisão e Operações)</option>
                  <option value="cashier">Operador de Caixa (Frente de Caixa / PDV)</option>
                  <option value="sales">Vendedor (Vendas e Atendimento)</option>
                  <option value="stock">Estoquista (Estoque e Inventário)</option>
                  <option value="financial">Financeiro (Contas a Pagar/Receber)</option>
                  <option value="owner">Proprietário (Acesso Irrestrito)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {ROLES_INFO[inviteRole].desc}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition shadow-md shadow-[#345CF3]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Convite'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Member Role */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Alterar Papel de Acesso
                </h3>
                <p className="text-[11px] text-slate-400">
                  Colaborador: <strong>{editingMember.userName}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Selecione o novo papel:
              </label>

              <div className="space-y-1.5">
                {(Object.keys(ROLES_INFO) as RoleCode[]).map(rCode => {
                  const isSelected = selectedRoleForEdit === rCode;
                  const rInfo = ROLES_INFO[rCode];
                  return (
                    <button
                      key={rCode}
                      type="button"
                      onClick={() => setSelectedRoleForEdit(rCode)}
                      className={`w-full p-2.5 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-[#345CF3]/10 border-[#345CF3] text-slate-900 dark:text-white font-bold' 
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div>
                        <span className="block">{rInfo.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{rInfo.desc}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#345CF3] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveRole}
                  className="px-5 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition shadow-md shadow-[#345CF3]/20"
                >
                  Confirmar Alteração
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
