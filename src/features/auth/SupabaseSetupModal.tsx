import React, { useState } from 'react';
import { 
  X, Database, CheckCircle2, AlertTriangle, 
  Copy, ExternalLink, ShieldCheck, Terminal, 
  Sparkles, Wifi, RefreshCw, Key, Globe, Check, 
  Trash2, HelpCircle, ChevronRight, MessageSquare, ArrowRight
} from 'lucide-react';
import { 
  getActiveSupabaseConfig, 
  testAndConnectSupabase, 
  clearSupabaseConfig 
} from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { RAON_INITIAL_SCHEMA_SQL } from '../../data/migrationSql';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isSandboxMode } = useAuth();
  
  const currentConfig = getActiveSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.anonKey);
  
  const [activeTab, setActiveTab] = useState<'connect' | 'step_by_step' | 'sql'>('step_by_step');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs?: number; message?: string } | null>(null);
  const [copiedMigration, setCopiedMigration] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const res = await testAndConnectSupabase(supabaseUrl, supabaseKey);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        latencyMs: res.latencyMs,
        message: `Conexão estabelecida com sucesso com o Supabase! Latência: ${res.latencyMs}ms. O Lucre+ está sincronizado.`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setTestResult({
        success: false,
        message: res.error || 'Falha ao conectar com o Supabase. Verifique se a URL e a chave estão corretas.',
      });
    }
  };

  const handleDisconnect = () => {
    if (confirm('Deseja desconectar as credenciais do Supabase e retornar ao Modo Sandbox?')) {
      clearSupabaseConfig();
      setSupabaseUrl('');
      setSupabaseKey('');
      setTestResult(null);
      window.location.reload();
    }
  };

  const handleCopyMigrationCode = async () => {
    await navigator.clipboard.writeText(RAON_INITIAL_SCHEMA_SQL);
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 2500);
  };

  const handleCopyEnvTemplate = () => {
    const envText = `VITE_SUPABASE_URL="${supabaseUrl || 'https://seu-projeto.supabase.co'}"\nVITE_SUPABASE_ANON_KEY="${supabaseKey || 'sua-chave-anon-aqui'}"`;
    navigator.clipboard.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-app-light text-app-primary flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Assistente de Configuração do Supabase
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentConfig.isConfigured 
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                }`}>
                  {currentConfig.isConfigured ? '🟢 Conectado Oficialmente' : '🟡 Modo Sandbox Ativo'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lucre+ • PostgreSQL, Supabase Auth e Row Level Security (RLS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('step_by_step')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'step_by_step'
                ? 'bg-[#345CF3] text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. Passo a Passo Guiado (Fácil)
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-[#345CF3] text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2. Inserir Chaves & Testar
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-[#345CF3] text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. Copiar Script SQL de Tabelas
          </button>
        </div>

        {/* TAB 1: PASSO A PASSO GUIADO */}
        {activeTab === 'step_by_step' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#345CF3]/10 border border-[#345CF3]/30 text-xs text-slate-700 dark:text-slate-200 space-y-1">
              <span className="font-bold text-[#345CF3] block text-sm">
                Fique tranquilo! É muito simples configurar o Supabase.
              </span>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Você só precisa de uma conta gratuita no Supabase. O banco de dados PostgreSQL é provisionado em 1 minuto e não exige cartão de crédito. Siga os 3 passos abaixo:
              </p>
            </div>

            {/* Passo 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#345CF3] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                  <span>Criar o Projeto no Supabase</span>
                </span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-xl bg-[#345CF3] text-white text-xs font-bold hover:bg-[#2849d4] transition flex items-center gap-1 shadow-xs"
                >
                  <span>Abrir Supabase Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                No site do Supabase, clique em <strong>"New Project"</strong>, escolha um nome (ex: <code>raon-system</code>), defina uma senha e escolha a região <strong>São Paulo (sa-east-1)</strong>. Aguarde 1 minuto para o banco inicializar.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#345CF3] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Onde pegar a URL e a Chave no Supabase:</span>
              </span>
              <div className="pl-7 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p>1. No menu lateral do Supabase, clique no ícone de engrenagem <strong>"Project Settings"</strong> (ou <strong>"API Keys"</strong>).</p>
                <p>2. Clique em <strong>"API"</strong>.</p>
                <p>3. Você verá dois campos:</p>
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1 my-1.5">
                  <p>• <strong>Project URL</strong>: começa com <code>https://...supabase.co</code></p>
                  <p>• <strong>Project API Keys (anon public)</strong>: começa com <code>eyJhbGciOi...</code></p>
                </div>
                <p>Basta copiar esses dois valores e colar na aba <strong>"2. Inserir Chaves & Testar"</strong> aqui neste assistente!</p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#345CF3] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>Executar a Migration no SQL Editor</span>
                </span>
                <button
                  onClick={handleCopyMigrationCode}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedMigration ? 'SQL Copiado com Sucesso!' : 'Copiar Script SQL'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                No menu lateral do Supabase, clique no ícone <strong>"SQL Editor"</strong>, clique em <strong>"New Query"</strong>, cole o script SQL e clique no botão verde <strong>"Run"</strong>. Todas as tabelas multi-tenant e papéis serão criados instantaneamente!
              </p>
            </div>

            {/* Alternativa amigável */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#345CF3]" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong>Quer que eu configure para você?</strong> Você também pode me mandar a URL e a Anon Key aqui na conversa que eu configuro diretamente no código!
                </span>
              </div>
              <button
                onClick={() => setActiveTab('connect')}
                className="px-3 py-1.5 rounded-xl bg-[#345CF3] text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                Inserir Agora
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INSERIR CHAVES E TESTAR */}
        {activeTab === 'connect' && (
          <form onSubmit={handleTestConnection} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#345CF3]" />
                  <span>Insira os Dados do seu Projeto</span>
                </span>
                {currentConfig.isConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="text-[11px] font-semibold text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Desconectar e Voltar ao Sandbox</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project URL (Endpoint do Supabase) *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      required
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrl}
                      onChange={e => setSupabaseUrl(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Encontrado em: Supabase Dashboard → Project Settings → API → Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Anon / Public API Key *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={e => setSupabaseKey(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Encontrado em: Supabase Dashboard → Project Settings → API → Project API Keys (anon public)
                  </span>
                </div>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-500/10 border border-red-500/30 text-red-500'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleCopyEnvTemplate}
                  className="text-xs font-semibold text-[#345CF3] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedEnv ? 'Variáveis Copiadas!' : 'Copiar formato .env'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-5 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition shadow-md shadow-[#345CF3]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isTesting ? 'Testando Conexão...' : 'Testar e Conectar ao Supabase'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: COPIAR SCRIPT SQL */}
        {activeTab === 'sql' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#8065E9]" />
                    <span>Script SQL de Migrations do RAON System</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Execute no Supabase SQL Editor para criar as tabelas com RLS
                  </p>
                </div>

                <button
                  onClick={handleCopyMigrationCode}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedMigration ? 'SQL Copiado para a Área de Transferência!' : 'Copiar SQL Completo'}</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800 select-all">
                <pre>{RAON_INITIAL_SCHEMA_SQL.substring(0, 1800)}...</pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#17B897]" />
            <span>Segurança garantida via Row Level Security</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
