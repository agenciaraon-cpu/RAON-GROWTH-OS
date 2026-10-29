import React, { useState } from 'react';
import { 
  Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Store, Sparkles, CheckCircle2, AlertCircle, Database, Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { ColorThemePicker } from '../../components/common/ColorThemePicker';

interface LoginViewProps {
  onSwitchToRegister: () => void;
  onOpenForgotPassword: () => void;
  onOpenSupabaseSetup: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSwitchToRegister,
  onOpenForgotPassword,
  onOpenSupabaseSetup,
}) => {
  const { login, isLoading } = useAuth();
  const { colorThemeOption } = useTheme();

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('varejou_remembered_email') || localStorage.getItem('lucre_remembered_email') || localStorage.getItem('raon_remembered_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(Boolean(localStorage.getItem('varejou_remembered_email') || localStorage.getItem('lucre_remembered_email') || localStorage.getItem('raon_remembered_email')));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    if (rememberEmail) {
      localStorage.setItem('varejou_remembered_email', email.trim());
    } else {
      localStorage.removeItem('varejou_remembered_email');
    }

    const res = await login(email.trim(), password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleQuickSandboxLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('12345678');
    login(userEmail, '12345678');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      {/* Left Institutional Branding Panel */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-linear-to-br from-[#0B1225] via-[#101A38] to-[#0B1225] text-white relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Glow ambient effects */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: colorThemeOption.hex }} 
        />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8065E9]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-app-gradient flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-app-glow">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">Varejou</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-app-light text-app-primary uppercase tracking-wider border border-app-primary/30">
                  SaaS Varejo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sua loja. Seu controle. Varejou!
              </p>
            </div>
          </div>
        </div>

        {/* Central Pitch */}
        <div className="my-10 relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17B897]/15 border border-[#17B897]/30 text-[#17B897] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Gestão Comercial para o Varejo com PostgreSQL & Multi-Tenant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Mais vendas, controle total e máxima rentabilidade na sua loja.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            O <strong className="text-white">Varejou</strong> foi desenvolvido para lojas de roupas, calçados, cosméticos, eletrônicos, variedades e comércios que buscam simplicidade operacional, agilidade no balcão e segurança.
          </p>

          {/* Plano Fixo Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-primary block">
                Plano Fixo Varejou
              </span>
              <span className="text-sm font-extrabold text-white block">
                Tudo incluso em um só lugar
              </span>
              <span className="text-[11px] text-slate-400">
                PDV Frente de Caixa, Roupas, Estoque, Clientes e WhatsApp
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-app-primary font-mono block">
                R$ 29,90
              </span>
              <span className="text-[10px] text-slate-400">por mês</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-white block">Multi-Tenant Seguro</span>
              <span className="text-[11px] text-slate-400">Isolamento total por loja no banco de dados</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-[#17B897] block">Supabase Conectado</span>
              <span className="text-[11px] text-slate-400">PostgreSQL com migrações prontas</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <span>Varejou • v1.0.0</span>
          <span>Fuso: America/Bahia (BRL)</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Acesse o Varejou
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Informe suas credenciais para gerenciar sua loja comercial.
              </p>
            </div>

            {/* Quick Color Toggle Button */}
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Personalizar cor do app"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Palette className="w-4 h-4 text-app-primary" />
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: colorThemeOption.hex }} 
              />
            </button>
          </div>

          {/* Color Picker Drawer / Accordion */}
          {showColorPicker && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-md animate-in fade-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Cores do Varejou (5 cores + padrão)
                </span>
                <span className="text-[10px] text-app-primary font-bold">
                  {colorThemeOption.name}
                </span>
              </div>
              <ColorThemePicker layout="row" showLabels={true} />
            </div>
          )}

          {/* Database indicator banner */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className={`w-4 h-4 ${isSupabaseConfigured ? 'text-[#17B897]' : 'text-amber-500'}`} />
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                {isSupabaseConfigured ? 'Banco: Supabase PostgreSQL Ativo' : 'Banco: Modo Sandbox / Setup Pendente'}
              </span>
            </div>
            <button
              onClick={onOpenSupabaseSetup}
              className="text-[11px] font-bold text-app-primary hover:underline cursor-pointer"
            >
              Configurar
            </button>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail de acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@empresa.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden transition shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs font-medium text-app-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden transition shadow-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Email Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberEmail}
                onChange={e => setRememberEmail(e.target.checked)}
                className="w-4 h-4 rounded text-app-primary focus:ring-app-primary border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                Lembrar preferência de e-mail neste navegador
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-app-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Lucre+'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Sandbox Logins */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Acesso Rápido para Demonstração (1 Clique)
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickSandboxLogin('agenciaraon@gmail.com')}
                className="w-full p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-left text-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">Thiago Pinheiro</span>
                  <span className="text-[10px] text-slate-400">Proprietário & Admin • agenciaraon@gmail.com</span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-app-light text-app-primary">Proprietário</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSandboxLogin('mateus.lima@raonsystem.com.br')}
                className="w-full p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-left text-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">Mateus Lima</span>
                  <span className="text-[10px] text-slate-400">Gerente de Operações • mateus.lima@raonsystem.com.br</span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">Gerente</span>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Não tem uma conta ainda?{' '}
              <button
                onClick={onSwitchToRegister}
                className="font-bold text-app-primary hover:underline cursor-pointer"
              >
                Cadastre sua empresa (Plano R$ 29,90/mês)
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
