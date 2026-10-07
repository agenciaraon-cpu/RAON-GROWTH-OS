import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, CheckCircle2, 
  Clock, AlertTriangle, User, Calendar, Trash2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Task, TaskPriority, TaskStatus } from '../../types';

export const TasksModule: React.FC = () => {
  const { tasks, addTask, updateTask, completeTask, deleteTask, leads } = useData();
  const { currentOrg } = useAuth();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    responsible: 'Roberto Lima (SDR)',
    dueDate: 'Hoje às 17:00',
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
    leadId: '',
  });

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTask({
      ...newTask,
      organizationId: currentOrg.id,
    });

    setNewTask({
      title: '',
      description: '',
      responsible: 'Roberto Lima (SDR)',
      dueDate: 'Hoje às 17:00',
      priority: 'medium',
      status: 'pending',
      leadId: '',
    });
    setIsModalOpen(false);
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EF4444]/20 text-[#EF4444]">Urgente</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FF7A18]/20 text-[#FF9F43]">Alta</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#38BDF8]/20 text-[#38BDF8]">Média</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#94A3B8]/20 text-[#94A3B8]">Baixa</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF7A18] bg-[#FF7A18]/10 px-2 py-0.5 rounded border border-[#FF7A18]/20">
              SISTEMA DE TAREFAS & FOLLOW-UPS
            </span>
            <span className="text-xs text-[#94A3B8]">RAON Growth OS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Gestão de Atividades & Prazos
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Acompanhe compromissos com clientes, prazos de envio de propostas e tarefas comerciais.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#FF7A18] to-[#FF9F43] hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-[#FF7A18]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Tarefa</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101522] p-3 rounded-xl border border-[#151C2C]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white placeholder-[#94A3B8] focus:border-[#38BDF8] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluída</option>
            <option value="overdue">Atrasada</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#151C2C] text-xs text-white outline-hidden"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-[#101522] border border-[#151C2C] rounded-2xl overflow-hidden shadow-lg">
        <div className="divide-y divide-[#151C2C]">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#94A3B8]">
              Nenhuma tarefa encontrada com os filtros selecionados.
            </div>
          ) : (
            filteredTasks.map(task => {
              const isCompleted = task.status === 'completed';
              const isOverdue = task.status === 'overdue';

              return (
                <div 
                  key={task.id} 
                  className={`p-4 flex items-center justify-between gap-4 transition hover:bg-[#151C2C]/50 ${
                    isCompleted ? 'opacity-60 bg-[#080B14]/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`mt-0.5 p-1 rounded-md border transition ${
                        isCompleted
                          ? 'bg-[#22C55E] border-[#22C55E] text-white'
                          : 'border-[#94A3B8]/40 text-transparent hover:border-[#22C55E]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-xs text-white ${isCompleted ? 'line-through text-[#94A3B8]' : ''}`}>
                          {task.title}
                        </h3>
                        {getPriorityBadge(task.priority)}
                        {isOverdue && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EF4444]/20 text-[#EF4444] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Atrasada
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-[#94A3B8] mt-1">{task.description}</p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-2">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                          {task.responsible}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#FF9F43]" />
                          Prazo: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#080B14] transition"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Criar Nova Tarefa</h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Título da Tarefa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Follow-up de proposta comercial"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Descrição Detalhada</label>
                <textarea
                  rows={2}
                  placeholder="Instruções e dados necessários..."
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Responsável</label>
                  <select
                    value={newTask.responsible}
                    onChange={e => setNewTask({ ...newTask, responsible: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  >
                    <option value="Thiago Pinheiro (CEO)">Thiago Pinheiro (CEO)</option>
                    <option value="Mateus Lima (Líder de Criativos)">Mateus Lima (Líder de Criativos)</option>
                    <option value="Gabriela Alencar (Administradora)">Gabriela Alencar (Administradora)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Prioridade</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 font-medium">Prazo de Conclusão</label>
                <input
                  type="text"
                  placeholder="Ex: Amanhã às 15:00"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-[#151C2C] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#151C2C] text-[#94A3B8] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white font-semibold"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
