import React, { useState } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  Store, Phone, ArrowLeft, Palette, Sparkles, AlertCircle
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

  // Campos solicitados pelo usuário
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeWhatsApp, setStoreWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatPhone = (val: string) => {
    let r = val.replace(/\D/g, '');
    if (r.length > 11) r = r.substring(0, 11);
    if (r.length > 6) {
      return `(${r.substring(0, 2)}) ${r.substring(2, 7)}-${r.substring(7)}`;
    } else if (r.length > 2) {
      return `(${r.substring(0, 2)}) ${r.substring(2)}`;
    } else if (r.length > 0) {
      return `(${r}`;
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Informe seu nome completo.');
      return;
    }
    if (!storeName.trim()) {
      setErrorMessage('Informe o nome da sua loja.');
      return;
    }
    if (!storeWhatsApp.trim() || storeWhatsApp.replace(/\D/g, '').length < 10) {
      setErrorMessage('Informe o WhatsApp do dono da loja com DDD.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Informe um e-mail válido para o login.');
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

    const res = await register({
      fullName: fullName.trim(),
      storeName: storeName.trim(),
      storeWhatsApp: storeWhatsApp.trim(),
      email: email.trim().toLowerCase(),
      password,
      storeColor: colorThemeOption.hex,
    });

    if (res.success) {
      onSuccessRegister();
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao login</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/assets/aistudio/logovarejo_0f870eab.png" 
              alt="Varejou" 
              className="w-12 h-12 object-contain rounded-xl shrink-0 filter drop-shadow-sm" 
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Cadastrar sua Loja no Varejou
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Preencha os dados abaixo para criar sua conta e ativar sua loja.
              </p>
            </div>
          </div>

          {/* Destaque do Plano Varejou R$ 29,90/mês */}
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Plano Varejou Completo
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Frente de Caixa (PDV), Roupas, Estoque, Clientes e WhatsApp
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-extrabold text-amber-500 font-mono block">
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nome Completo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo Silva"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Nome da Loja */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nome da Loja *
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Boutique Elegance / Prime Calçados"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-medium"
              />
            </div>
          </div>

          {/* WhatsApp do Dono da Loja e E-mail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp do Dono da Loja *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="(75) 98864-4742"
                  value={storeWhatsApp}
                  onChange={e => setStoreWhatsApp(formatPhone(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                E-mail (Fundamental para Login) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@loja.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Senha e Confirmar Senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirmar a Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Escolha da Cor da Loja (5 Cores + Padrão) */}
          <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Palette className="w-3.5 h-3.5 text-app-primary" />
                <span>Escolha a cor da sua loja:</span>
              </label>
              <span className="text-[10px] text-app-primary font-bold">
                {colorThemeOption.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              Selecione entre as 5 cores (Verde Escuro, Rosa Choque, Preto, Laranja Ouro, Roxo) ou a cor padrão:
            </p>
            <ColorThemePicker layout="row" showLabels={true} />
          </div>

          {/* Botão Oficial: "Criar conta" */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <span>{isLoading ? 'Criando conta...' : 'Criar conta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Já tem uma conta cadastrada?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-[#345CF3] hover:underline cursor-pointer"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
