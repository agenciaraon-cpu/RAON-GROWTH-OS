import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, ShieldAlert, Users, 
  FileText, Lock, Download, Trash2, Clock, CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsModule: React.FC = () => {
  const { auditLogs } = useData();
  const { currentOrg, currentUser, currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'audit' | 'lgpd' | 'team'>('audit');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              SEGURANÇA & COMPLIANCE
            </span>
            <span className="text-xs text-[#94A3B8]">RAON GROWTH OS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Auditoria, Permissões & LGPD
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Trilha de auditoria em tempo real, proteção de dados dos leads e isolamento estrito multi-tenant.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#101522] p-2 rounded-xl border border-[#151C2C] overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'audit' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Trilha de Auditoria (Audit Log)
        </button>
        <button
          onClick={() => setActiveTab('lgpd')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'lgpd' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Compliance LGPD & Privacidade
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'team' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Equipe & Matriz de Permissões
        </button>
      </div>

      {/* TAB 1: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-[#101522] border border-[#151C2C] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#151C2C]">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#38BDF8]" />
                Audit Trail — Registro de Operações
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Logs imutáveis de logins, modificações de pipeline, edições e integrações no tenant {currentOrg.name}.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">
              Logs Gravados: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#151C2C]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B14] text-[#94A3B8] uppercase text-[10px] font-mono tracking-wider border-b border-[#151C2C]">
                <tr>
                  <th className="py-3 px-4">Momento</th>
                  <th className="py-3 px-4">Operador</th>
                  <th className="py-3 px-4">Ação</th>
                  <th className="py-3 px-4">Entidade</th>
                  <th className="py-3 px-4">Detalhes da Operação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151C2C]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#151C2C]/50 transition">
                    <td className="py-3.5 px-4 font-mono text-[#94A3B8]">{log.createdAt}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{log.userName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        log.action === 'create' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                        log.action === 'edit' ? 'bg-[#38BDF8]/20 text-[#38BDF8]' :
                        log.action === 'delete' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                        log.action === 'stage_change' ? 'bg-[#FF7A18]/20 text-[#FF9F43]' :
                        'bg-[#151C2C] text-white'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#38BDF8]">{log.entity}</td>
                    <td className="py-3.5 px-4 text-[#F8FAFC]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LGPD */}
      {activeTab === 'lgpd' && (
        <div className="bg-[#101522] border border-[#151C2C] rounded-2xl p-6 shadow-lg space-y-5 text-xs">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              Conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Todos os dados captados em landing pages, formulários e WhatsApp possuem bases legais de consentimento e legítimo interesse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-2">
              <h3 className="font-semibold text-white">Direito de Anonimização & Exclusão</h3>
              <p className="text-[#94A3B8]">
                Permite apagar ou descaracterizar todos os dados pessoais de um lead sob requisição do titular com 1 clique no CRM.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-2">
              <h3 className="font-semibold text-white">Exportação e Portabilidade</h3>
              <p className="text-[#94A3B8]">
                Disponibiliza relatório estruturado em formato CSV/JSON com todas as interações e registros vinculados ao CPF ou e-mail.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM & PERMISSIONS */}
      {activeTab === 'team' && (
        <div className="bg-[#101522] border border-[#151C2C] rounded-2xl p-6 shadow-lg space-y-5 text-xs">
          <h2 className="text-base font-bold text-white">Matriz de Perfis e Controle de Acesso (RBAC)</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">SUPER ADMIN (Equipe RAON)</span>
                <span className="text-[#94A3B8]">Acesso ilimitado a todas as organizações, criação de clientes, IA global, finanças e auditoria.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#FF7A18]/20 text-[#FF9F43] font-bold text-[10px]">Acesso Total</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">CLIENT ADMIN (Empresa Cliente)</span>
                <span className="text-[#94A3B8]">Gerenciamento de CRM, leads, equipe de vendas, campanhas e relatórios exclusivamente da sua empresa.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#2563EB]/20 text-[#38BDF8] font-bold text-[10px]">Administrador do Tenant</span>
            </div>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">SALES USER (Comercial / SDR / Closer)</span>
                <span className="text-[#94A3B8]">Visualização de leads atribuídos, movimentação no Kanban, registro de ligações e notas.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#22C55E]/20 text-[#22C55E] font-bold text-[10px]">Operador Comercial</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
