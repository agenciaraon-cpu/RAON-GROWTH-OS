import React, { useState } from 'react';
import { 
  Lock, Mail, Eye, EyeOff, ArrowRight, 
  Sparkles, MessageCircle, CheckCircle2, X, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginViewProps {
  onSwitchToRegister: () => void;
  onOpenForgotPassword: () => void;
  onOpenSupabaseSetup: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSwitchToRegister,
  onOpenForgotPassword,
}) => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('varejou_remembered_email') || localStorage.getItem('lucre_remembered_email') || localStorage.getItem('raon_remembered_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(Boolean(
    localStorage.getItem('varejou_remembered_email') || 
    localStorage.getItem('lucre_remembered_email') || 
    localStorage.getItem('raon_remembered_email')
  ));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail de acesso.');
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

  const handleOpenWhatsAppConsult = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de consultar as condições para ter o Varejou como um app personalizado com pagamento único para a minha empresa.'
    );
    window.open(`https://wa.me/5571983032979?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      {/* Painel Institucional Esquerdo */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-linear-to-br from-[#0B1225] via-[#101A38] to-[#0B1225] text-white relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Efeitos de iluminação sutil */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 bg-[#F59E0B]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15 bg-[#345CF3]" />

        {/* Topo do Painel com Logomarca Oficial */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/logovarejo_0f870eab.png" 
              alt="Varejou" 
              className="h-12 w-auto object-contain filter drop-shadow-md"
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Sua loja. Seu controle.
          </span>
        </div>

        {/* Centro: Logomarca Maior em Destaque + Chamada Principal + Valor + Botão Grande */}
        <div className="my-8 relative z-10 space-y-6 max-w-xl mx-auto w-full text-center lg:text-left">
          {/* Imagem Maior da Logomarca Varejou */}
          <div className="flex justify-center lg:justify-start">
            <div className="p-3 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl inline-block">
              <img 
                src="/assets/aistudio/logovarejo_0f870eab.png" 
                alt="Logomarca Varejou" 
                className="w-36 sm:w-44 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Mais vendas, controle total e máxima rentabilidade na sua loja.
          </h1>

          {/* Subtítulo com Tudo Incluso + Destaque dos 29,90 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Tudo incluso em um só lugar
              </span>
            </div>

            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              PDV, frente de caixa, roupas, estoque, clientes e WhatsApp.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-300">
                Plano completo sem fidelidade:
              </span>
              <div className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-white">
                <span className="text-xs font-semibold text-amber-300">Tudo isso por apenas</span>
                <span className="text-lg font-extrabold text-amber-400 font-mono">R$ 29,90</span>
                <span className="text-[11px] text-slate-300">/ mês</span>
              </div>
            </div>
          </div>

          {/* Botão Grande de Consulta para App Personalizado com Pagamento Único */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsConditionsModalOpen(true)}
              className="w-full group p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 font-black shadow-xl shadow-amber-500/20 transition-all duration-200 transform hover:-translate-y-0.5 text-center flex flex-col items-center justify-center cursor-pointer border border-amber-300/40"
            >
              <div className="flex items-center gap-2 text-base sm:text-lg font-black tracking-tight">
                <span>Consulte agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1">
                Caso você queira ter um app personalizado com pagamento único, ver condições
              </span>
            </button>
          </div>
        </div>

        {/* Rodapé institucional limpo */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <span>Varejou • Gestão Comercial</span>
          <span>RAON Tecnologia</span>
        </div>
      </div>

      {/* Painel Direito: Formulário Limpo de Login */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-7">
          {/* Cabeçalho do Login */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 lg:hidden">
              <img 
                src="/assets/aistudio/logovarejo_0f870eab.png" 
                alt="Varejou" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Acesse o Varejou
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Entre com suas credenciais para gerenciar sua loja comercial.
            </p>
          </div>

          {/* Mensagem de Erro (se houver) */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário com E-mail de Acesso e Senha */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                E-mail de acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@loja.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] focus:ring-2 focus:ring-[#345CF3]/20 outline-hidden transition shadow-xs font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs font-semibold text-[#345CF3] hover:underline cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] focus:ring-2 focus:ring-[#345CF3]/20 outline-hidden transition shadow-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar e-mail */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberEmail}
                onChange={e => setRememberEmail(e.target.checked)}
                className="w-4 h-4 rounded text-[#345CF3] focus:ring-[#345CF3] border-slate-300 dark:border-slate-700 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                Lembrar preferência de e-mail neste navegador
              </label>
            </div>

            {/* Botão de Login Exato: "Entrar no Varejou" */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0B1225] via-[#101A38] to-[#0B1225] hover:from-[#15234A] hover:to-[#15234A] text-white font-extrabold text-sm transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-slate-700/60"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Varejou'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Destaque Obrigatório: Não tem uma conta ainda? Cadastre a sua empresa agora mesmo */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/30 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Não tem uma conta ainda?
              </p>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Cadastre a sua empresa agora mesmo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Condições: App Personalizado com Pagamento Único */}
      {isConditionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/logovarejo_0f870eab.png" 
                  alt="Varejou" 
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    App Personalizado — Pagamento Único
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tenha o seu próprio software sem mensalidades recorrentes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConditionsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Para empresas e redes comerciais que preferem autonomia total com <strong>pagamento único</strong>, disponibilizamos a versão personalizada do <strong>Varejou</strong>:
              </p>

              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Identidade Visual Exclusiva:</strong> Sua logomarca, suas cores e domínio próprio (ex: suaempresa.com.br).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sem Mensalidades:</strong> Pagamento único com licença perpétua para as operações da sua loja.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Módulos Completos:</strong> PDV Frente de Caixa, controle de roupas e tamanhos, estoque, crediário e WhatsApp.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Suporte e Implantação:</strong> Treinamento de equipe e instalação assistida pela equipe RAON.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenWhatsAppConsult}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com Consultor no WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setIsConditionsModalOpen(false)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginView;
