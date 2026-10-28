import React, { useState } from 'react';
import { 
  HelpCircle, Database, FileText, CheckCircle2, 
  ExternalLink, Mail, Phone, MessageSquare, Copy, 
  ShieldCheck, Terminal, Sparkles
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const [copiedMigration, setCopiedMigration] = useState(false);

  const handleCopyMigrationCommand = () => {
    navigator.clipboard.writeText('supabase/migrations/20250101000000_raon_system_initial_schema.sql');
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Central de Ajuda & Suporte Técnico
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Documentação de arquitetura, migrations do banco de dados e canais oficiais da RAON.
        </p>
      </div>

      {/* RAON Institutional Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#101A38] to-[#0B1225] text-white border border-[#345CF3]/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/15 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30">
            DESENVOLVEDORA OFICIAL
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white">
          RAON — Marketing, IA & Tecnologia
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          O <strong>RAON System</strong> é uma plataforma SaaS projetada para atender ao comércio varejista brasileiro com máxima segurança, conformidade e velocidade operacional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#38BDF8]" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">E-mail de Suporte</span>
              <span className="text-xs font-mono font-bold text-white">agenciaraon@gmail.com</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#17B897]" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">WhatsApp / Telefone</span>
              <span className="text-xs font-mono font-bold text-white">(71) 98303-2979</span>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Migration & Schema Reference */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#345CF3]" />
              <span>Arquivo de Migrations SQL Versionado</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Localização: <code>supabase/migrations/20250101000000_raon_system_initial_schema.sql</code>
            </p>
          </div>
          <button
            onClick={handleCopyMigrationCommand}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-[#345CF3] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedMigration ? 'Caminho Copiado!' : 'Copiar Caminho'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs space-y-2 overflow-x-auto">
          <p className="text-emerald-400">// Tabelas criadas com RLS habilitado:</p>
          <p>• public.profiles (vinculado a auth.users)</p>
          <p>• public.tenants (empresas isoladas por tenant_id UUID)</p>
          <p>• public.tenant_members (associação de membros com papéis)</p>
          <p>• public.roles (owner, manager, cashier, sales, stock, financial)</p>
          <p>• public.tenant_settings (preferências, fuso America/Bahia, BRL)</p>
          <p>• public.tenant_invitations (convites de funcionários por e-mail)</p>
          <p>• public.plans & public.subscriptions (estrutura SaaS)</p>
          <p>• public.audit_logs (registros imutáveis de auditoria)</p>
        </div>
      </div>

      {/* Security Checklist (Etapa 1 Verification) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#17B897]" />
          <span>Critérios de Segurança & Arquitetura Concluídos</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            'Isolamento multiempresa rigoroso por tenant_id UUID',
            'PostgreSQL com Row Level Security (RLS) habilitado',
            'Funções seguras com search_path controlado',
            'Proteção contra autoatribuição de papéis ou privilégios',
            'Regra anti-abandono: empresas não ficam sem proprietário',
            'Upload seguro de fotos com validação estrita de MIME e tamanho',
            'Privacidade dos dados comerciais dos lojistas preservada',
            'Ambiente pronto para expansão para Frente de Caixa e Estoque',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#17B897] shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
