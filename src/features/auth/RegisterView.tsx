import React, { useState } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  ShieldCheck, AlertCircle, ArrowLeft, Palette, Sparkles, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ColorThemePicker } from '../../components/common/ColorThemePicker';
import { useTheme } from '../../context/ThemeContext';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
  onSuccessRegister: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onSwitchToLogin,
  onSuccessRegister,
}) => {
  const { register, isLoading } = useAuth();
  const { colorThemeOption } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas informadas não coincidem.');
      return;
    }

    const res = await register(fullName.trim(), email.trim(), password);
    if (res.success) {
      onSuccessRegister();
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao login</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-app-gradient flex items-center justify-center text-white font-black text-base shadow-md shadow-app-glow">
              V
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Criar conta no Varejou
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cadastre seu perfil de lojista para começar a cadastrar sua empresa, roupas, produtos e emitir vendas no PDV.
          </p>

          {/* Plano Fixo Varejou Callout */}
          <div className="mt-3 p-3 rounded-2xl bg-app-light border border-app-primary/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-app-primary shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Plano Fixo Varejou
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Todos os módulos inclusos • 14 dias de teste grátis
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-app-primary font-mono block">
                R$ 29,90
              </span>
              <span className="text-[9px] text-slate-400">/mês</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Seu Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Carlos Silva"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              E-mail Comercial / Profissional *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="carlos@minhaloja.com.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden transition font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Senha (mínimo 6 dígitos) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Escolha da Cor do App */}
          <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Palette className="w-3.5 h-3.5 text-app-primary" />
                <span>Escolha a cor do seu Varejou:</span>
              </label>
              <span className="text-[10px] text-app-primary font-semibold">
                {colorThemeOption.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              Selecione entre as 5 cores principais ou a cor padrão para personalizar o sistema:
            </p>
            <ColorThemePicker layout="row" showLabels={true} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-app-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <span>{isLoading ? 'Criando conta...' : 'Criar Conta e Configurar Loja'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-app-primary hover:underline cursor-pointer"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
