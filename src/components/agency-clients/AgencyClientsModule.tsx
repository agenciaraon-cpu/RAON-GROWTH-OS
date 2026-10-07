import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Filter, DollarSign, Calendar, 
  CheckCircle2, AlertTriangle, Clock, Phone, Instagram, 
  Trash2, Edit, ExternalLink, ShieldCheck, ArrowUpRight, 
  TrendingUp, Users, MessageSquare, Check, X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AgencyClient, AgencyPlan, PaymentStatus } from '../../types';
import { AgencyClientModal } from './AgencyClientModal';
import { AgencyWhatsAppAutomationsModal } from './AgencyWhatsAppAutomationsModal';

export const AgencyClientsModule: React.FC = () => {
  const { agencyClients, addAgencyClient, updateAgencyClient, deleteAgencyClient, updateAgencyPaymentStatus } = useData();

  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AgencyClient | null>(null);

  // Filtered clients
  const filteredClients = agencyClients.filter(c => {
    const matchesSearch = 
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.document.includes(search) ||
      c.phone.includes(search);
    const matchesPlan = selectedPlan === 'all' || c.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || c.paymentStatus === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Dashboard calculations
  const totalClients = agencyClients.length;
  const totalMrr = agencyClients.reduce((sum, c) => sum + c.monthlyValue, 0);
  const paidClients = agencyClients.filter(c => c.paymentStatus === 'paid');
  const pendingClients = agencyClients.filter(c => c.paymentStatus === 'pending');
  const overdueClients = agencyClients.filter(c => c.paymentStatus === 'overdue');

  const totalPaidValue = paidClients.reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalPendingValue = pendingClients.reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalOverdueValue = overdueClients.reduce((sum, c) => sum + c.monthlyValue, 0);
  const avgTicket = totalClients > 0 ? Math.round(totalMrr / totalClients) : 0;

  // Plan counts
  const bronzeCount = agencyClients.filter(c => c.plan === 'Bronze').length;
  const prataCount = agencyClients.filter(c => c.plan === 'Prata').length;
  const ouroCount = agencyClients.filter(c => c.plan === 'Ouro').length;

  const handleOpenEdit = (client: AgencyClient) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<AgencyClient, 'id' | 'createdAt'>) => {
    if (editingClient) {
      updateAgencyClient(editingClient.id, data);
    } else {
      addAgencyClient(data);
    }
  };

  const getPlanBadge = (plan: AgencyPlan) => {
    if (plan === 'Ouro') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> OURO
        </span>
      );
    }
    if (plan === 'Prata') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#94A3B8]/20 text-[#F8FAFC] border border-[#94A3B8]/40 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" /> PRATA
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#D97706]/15 text-[#F59E0B] border border-[#D97706]/30 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" /> BRONZE
      </span>
    );
  };

  const getStatusBadge = (status: PaymentStatus) => {
    if (status === 'paid') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> A Vencer
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1">
        <AlertTriangle className="w-3.5 h-3.5" /> Atrasado
      </span>
    );
  };

  const handleWhatsAppContact = (client: AgencyClient) => {
    const cleanPhone = client.phone.replace(/\D/g, '');
    let msg = `Olá ${encodeURIComponent(client.clientName)}, tudo bem? Aqui é da equipe da Agência RAON!`;
    if (client.paymentStatus === 'overdue') {
      msg = `Olá ${encodeURIComponent(client.clientName)}, tudo bem? Notamos que a fatura referente aos serviços de marketing e tráfego da ${encodeURIComponent(client.companyName)} com vencimento dia ${client.dueDay} está pendente. Segue a chave Pix para regularização. Qualquer dúvida estamos à disposição!`;
    }
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#101522] via-[#151C2C] to-[#101522] border border-[#FF7A18]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF7A18] bg-[#FF7A18]/15 px-2.5 py-0.5 rounded border border-[#FF7A18]/30">
              PAINEL SUPER ADMIN — AGÊNCIA RAON
            </span>
            <span className="text-xs text-[#94A3B8]">Gestão de Clientes & Mensalidades</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Clientes Ativos de Marketing & Contratos
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl mt-1">
            Controle exclusivo sobre os clientes da agência RAON (Instagram, tráfego pago, criativos, plano Bronze/Prata/Ouro e vencimentos).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#22C55E]/25 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp API & Mensagens Automáticas</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Cliente da Agência</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD EXCLUSIVO DOS CLIENTES DA AGÊNCIA */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Clientes */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Clientes Ativos</span>
          <div className="text-2xl font-bold text-white mt-1">{totalClients}</div>
          <span className="text-[10px] text-[#22C55E] flex items-center gap-0.5 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> Em Operação
          </span>
        </div>

        {/* MRR Total */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#22C55E]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Faturamento Mensal (MRR)</span>
          <div className="text-xl sm:text-2xl font-bold text-[#22C55E] mt-1 font-mono">
            R$ {totalMrr.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono">
            {totalClients} clientes na base
          </span>
        </div>

        {/* Total Recebido */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#22C55E]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Mensalidades Pagas</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono">
            R$ {totalPaidValue.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#22C55E] font-medium">
            {paidClients.length} de {totalClients} recebidos
          </span>
        </div>

        {/* Total Pendente */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">A Vencer (Pendente)</span>
          <div className="text-xl sm:text-2xl font-bold text-[#38BDF8] mt-1 font-mono">
            R$ {totalPendingValue.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#94A3B8]">
            {pendingClients.length} contratos a vencer
          </span>
        </div>

        {/* Inadimplência / Atrasados */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#EF4444]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Em Atraso</span>
          <div className="text-xl sm:text-2xl font-bold text-[#EF4444] mt-1 font-mono">
            R$ {totalOverdueValue.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#EF4444] font-medium">
            {overdueClients.length} {overdueClients.length === 1 ? 'cliente atrasado' : 'clientes atrasados'}
          </span>
        </div>

        {/* Ticket Médio */}
        <div className="p-4 rounded-xl bg-[#101522] border border-[#151C2C] hover:border-[#FF7A18]/40 transition">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Ticket Médio RAON</span>
          <div className="text-xl sm:text-2xl font-bold text-[#FF9F43] mt-1 font-mono">
            R$ {Math.round(avgTicket).toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-[#94A3B8]">Por cliente/mês</span>
        </div>
      </div>

      {/* Distribuição por Planos & Alerta de Cobrança */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Distribuição de Planos (Bronze, Prata, Ouro) */}
        <div className="md:col-span-8 p-4 rounded-xl bg-[#101522] border border-[#151C2C] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#151C2C]">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#FF7A18]" />
              Distribuição por Planos Contratados
            </span>
            <span className="text-[10px] text-[#94A3B8] font-mono">
              Bronze (R$ 2.8k) • Prata (R$ 5.5k) • Ouro (R$ 8.9k+)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-lg bg-[#080B14] border border-[#D97706]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F59E0B]">Plano Bronze</span>
                <span className="text-xs font-mono font-bold text-white">{bronzeCount}</span>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-1">Gestão de Instagram & Criativos</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B14] border border-[#94A3B8]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F8FAFC]">Plano Prata</span>
                <span className="text-xs font-mono font-bold text-white">{prataCount}</span>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-1">Instagram + Tráfego Pago Meta</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B14] border border-[#F59E0B]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FBBF24]">Plano Ouro</span>
                <span className="text-xs font-mono font-bold text-white">{ouroCount}</span>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-1">Completo (Instagram, Tráfego, Vídeos, Copy)</p>
            </div>
          </div>
        </div>

        {/* Alerta de Atrasos / Ações */}
        <div className="md:col-span-4 p-4 rounded-xl bg-[#101522] border border-[#151C2C] flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              Atenção Financeira da Agência
            </span>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              {overdueClients.length > 0 ? (
                <span>
                  Existem <b>{overdueClients.length} faturas em atraso</b> totalizando R$ {totalOverdueValue.toLocaleString('pt-BR')}.
                </span>
              ) : (
                <span className="text-[#22C55E]">Todos os clientes estão com as mensalidades em dia!</span>
              )}
            </p>
          </div>

          {overdueClients.length > 0 && (
            <button
              onClick={() => setSelectedStatus('overdue')}
              className="mt-3 w-full py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444] text-[#EF4444] hover:text-white transition font-semibold text-xs flex items-center justify-center gap-1"
            >
              <span>Ver Clientes em Atraso</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101522] p-3 rounded-xl border border-[#151C2C]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por cliente, empresa, CNPJ/CPF ou tel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Plan Filter */}
          <select
            value={selectedPlan}
            onChange={e => setSelectedPlan(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden font-medium"
          >
            <option value="all">Todos os Planos</option>
            <option value="Bronze">Plano Bronze</option>
            <option value="Prata">Plano Prata</option>
            <option value="Ouro">Plano Ouro</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden font-medium"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pago</option>
            <option value="pending">A Vencer</option>
            <option value="overdue">Atrasado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Clientes da Agência */}
      <div className="bg-[#101522] border border-[#151C2C] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#151C2C] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Contratos de Marketing Ativos ({filteredClients.length})</span>
          </h2>
          <span className="text-xs text-[#94A3B8]">
            Total Filtrado: <b className="text-[#22C55E] font-mono">
              R$ {filteredClients.reduce((s, c) => s + c.monthlyValue, 0).toLocaleString('pt-BR')} /mês
            </b>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
              <tr>
                <th className="py-3 px-4">Cliente / Empresa</th>
                <th className="py-3 px-4">CPF / CNPJ & Contato</th>
                <th className="py-3 px-4">Plano</th>
                <th className="py-3 px-4">Valor Mensal</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Status Pagamento</th>
                <th className="py-3 px-4">Serviços Contratados</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151C2C]">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#94A3B8] text-xs">
                    Nenhum cliente encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-[#151C2C]/50 transition group">
                    {/* Cliente / Empresa */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-[#38BDF8] transition text-xs">
                        {client.companyName}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                        <span>{client.clientName}</span>
                        {client.instagram && (
                          <span className="text-[#38BDF8] font-mono">{client.instagram}</span>
                        )}
                      </div>
                    </td>

                    {/* Documento & Contato */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-white text-[11px]">{client.document}</div>
                      <div className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#22C55E]" />
                        <span>{client.phone}</span>
                      </div>
                    </td>

                    {/* Plano */}
                    <td className="py-3.5 px-4">
                      {getPlanBadge(client.plan)}
                    </td>

                    {/* Valor Mensal */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#22C55E] text-xs">
                      R$ {client.monthlyValue.toLocaleString('pt-BR')}
                    </td>

                    {/* Vencimento */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-white font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#FF9F43]" />
                        <span>Dia {client.dueDay < 10 ? `0${client.dueDay}` : client.dueDay}</span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        Início: {new Date(client.contractStartDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>

                    {/* Status Pagamento */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(client.paymentStatus)}
                        {/* Quick toggle payment */}
                        {client.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => updateAgencyPaymentStatus(client.id, 'paid')}
                            title="Marcar como Pago"
                            className="p-1 rounded bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Serviços */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {client.services.slice(0, 2).map((s, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#080B14] border border-[#151C2C] text-[#94A3B8] truncate">
                            {s}
                          </span>
                        ))}
                        {client.services.length > 2 && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-[#151C2C] text-[#38BDF8]">
                            +{client.services.length - 2}
                          </span>
                        )}
                      </div>
                      {client.responsibleStaffName && (
                        <span className="text-[9px] text-[#94A3B8] block mt-1">
                          Resp: {client.responsibleStaffName.split(' ')[0]}
                        </span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleWhatsAppContact(client)}
                          className="p-1.5 rounded-lg bg-[#22C55E]/15 text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition"
                          title="Falar no WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151C2C] transition"
                          title="Editar Cliente"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja remover o cliente ${client.companyName}?`)) {
                              deleteAgencyClient(client.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#151C2C] transition"
                          title="Excluir Cliente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cliente */}
      <AgencyClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingClient}
      />

      {/* Modal de Automações WhatsApp da Agência */}
      <AgencyWhatsAppAutomationsModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </div>
  );
};
