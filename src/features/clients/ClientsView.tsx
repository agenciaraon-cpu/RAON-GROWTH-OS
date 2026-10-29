import React, { useState } from 'react';
import { 
  Users, UserPlus, Phone, Mail, MapPin, 
  DollarSign, CheckCircle2, AlertCircle, Edit, 
  Trash2, Search, MessageSquare, Receipt, X, ArrowRight
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';
import { Client } from '../../types';

export const ClientsView: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, recordClientPayment } = useRetailData();
  const { currentTenant } = useAuth();

  const [search, setSearch] = useState('');
  const [filterDebt, setFilterDebt] = useState<'todos' | 'em_debito' | 'em_dia'>('todos');

  // Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Payment Modal
  const [payingClient, setPayingClient] = useState<Client | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState('500.00');
  const [currentDebt, setCurrentDebt] = useState('0.00');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openNewClientModal = () => {
    setEditingClient(null);
    setName('');
    setPhone('');
    setEmail('');
    setCpf('');
    setAddress('');
    setCreditLimit('500.00');
    setCurrentDebt('0.00');
    setNotes('');
    setFormError(null);
    setIsClientModalOpen(true);
  };

  const openEditModal = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setCpf(c.cpf || '');
    setAddress(c.address || '');
    setCreditLimit(c.creditLimit.toString());
    setCurrentDebt(c.currentDebt.toString());
    setNotes(c.notes || '');
    setFormError(null);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Informe o nome do cliente.');
      return;
    }

    if (!phone.trim()) {
      setFormError('Informe o telefone ou WhatsApp do cliente.');
      return;
    }

    const limit = parseFloat(creditLimit) || 0;
    const debt = parseFloat(currentDebt) || 0;

    if (editingClient) {
      await updateClient(editingClient.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        cpf: cpf.trim() || undefined,
        address: address.trim() || undefined,
        creditLimit: limit,
        currentDebt: debt,
        notes: notes.trim() || undefined,
      });
    } else {
      await addClient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        cpf: cpf.trim() || undefined,
        address: address.trim() || undefined,
        creditLimit: limit,
        currentDebt: debt,
        notes: notes.trim() || undefined,
      });
    }

    setIsClientModalOpen(false);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingClient) return;

    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      alert('Informe um valor de pagamento válido.');
      return;
    }

    await recordClientPayment(payingClient.id, amount);
    setPayingClient(null);
    setPaymentAmount('');
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.cpf && c.cpf.includes(search));

    if (filterDebt === 'em_debito') return matchesSearch && c.currentDebt > 0;
    if (filterDebt === 'em_dia') return matchesSearch && c.currentDebt === 0;
    return matchesSearch;
  });

  const totalReceivables = clients.reduce((acc, c) => acc + c.currentDebt, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-app-primary/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-app-primary bg-app-light px-2.5 py-0.5 rounded-full border border-app-primary/30">
              GESTÃO DE CLIENTES & CREDIÁRIO
            </span>
            <span className="text-xs text-slate-400">
              Loja: {currentTenant?.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Cadastro de Clientes & Vendas a Prazo
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Cadastre clientes, consulte histórico, gerencie limites de crediário/fiado e receba pagamentos parciais ou totais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Total a Receber</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              R$ {totalReceivables.toFixed(2)}
            </span>
          </div>

          <button
            onClick={openNewClientModal}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-app-glow shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone/WhatsApp ou CPF do cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterDebt('todos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterDebt === 'todos'
                ? 'bg-app-primary text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Todos ({clients.length})
          </button>
          <button
            onClick={() => setFilterDebt('em_debito')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterDebt === 'em_debito'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Com Débito Aberto ({clients.filter(c => c.currentDebt > 0).length})
          </button>
          <button
            onClick={() => setFilterDebt('em_dia')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterDebt === 'em_dia'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Em Dia ({clients.filter(c => c.currentDebt === 0).length})
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Nome do Cliente</th>
                <th className="py-3 px-4">Contato / WhatsApp</th>
                <th className="py-3 px-4">CPF / Endereço</th>
                <th className="py-3 px-4">Limite de Crédito</th>
                <th className="py-3 px-4">Saldo Devedor</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredClients.map(c => {
                const hasDebt = c.currentDebt > 0;
                const cleanPhone = c.phone.replace(/\D/g, '');

                return (
                  <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {c.name}
                      </div>
                      {c.notes && (
                        <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                          {c.notes}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{c.phone}</span>
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(c.name)}%2C%20tudo%20bem%3F`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-[#17B897]/15 text-[#17B897] hover:bg-[#17B897]/25"
                            title="Conversar no WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {c.email && (
                        <span className="text-[10px] text-slate-400 block font-sans truncate">{c.email}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-700 dark:text-slate-300 block">{c.cpf || 'Não informado'}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">{c.address || 'Sem endereço'}</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-slate-800 dark:text-slate-200">R$ {c.creditLimit.toFixed(2)}</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${hasDebt ? 'text-amber-500' : 'text-emerald-500'}`}>
                          R$ {c.currentDebt.toFixed(2)}
                        </span>
                        {hasDebt && (
                          <button
                            onClick={() => {
                              setPayingClient(c);
                              setPaymentAmount(c.currentDebt.toString());
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] hover:bg-emerald-500/25 transition cursor-pointer"
                          >
                            Baixar
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Editar Cliente"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Deseja realmente remover o cliente "${c.name}"?`)) {
                              deleteClient(c.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          title="Excluir Cliente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Users className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs">Nenhum cliente cadastrado no momento.</p>
            <button
              onClick={openNewClientModal}
              className="text-xs font-bold text-app-primary hover:underline"
            >
              + Cadastrar primeiro cliente agora
            </button>
          </div>
        )}
      </div>

      {/* Modal: New / Edit Client */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-app-light text-app-primary flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dados de contato e controle de limite de crediário.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome Completo do Cliente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Silva Vasconcelos"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold outline-hidden focus:border-app-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(71) 99999-8888"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    CPF (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="amanda@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Endereço / Bairro
                </label>
                <input
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Limite de Crediário (R$)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={creditLimit}
                    onChange={e => setCreditLimit(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Saldo Devedor Atual (R$)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={currentDebt}
                    onChange={e => setCurrentDebt(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Observações / Preferências
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Veste tamanho M, gosta de tons pastéis, prefere ser lembrada via WhatsApp."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-app-glow cursor-pointer"
                >
                  {editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Payment / Quitar Débito */}
      {payingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <span>Receber Pagamento de Crediário</span>
              </h3>
              <button onClick={() => setPayingClient(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cliente: <strong className="text-slate-900 dark:text-white">{payingClient.name}</strong>
            </p>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center text-xs">
              <span className="text-amber-700 dark:text-amber-300">Débito Atual:</span>
              <span className="font-bold font-mono text-amber-500 text-sm">
                R$ {payingClient.currentDebt.toFixed(2)}
              </span>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Valor Pago pelo Cliente (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentAmount(payingClient.currentDebt.toString())}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Quitar Total
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md cursor-pointer"
                >
                  Confirmar Recebimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
