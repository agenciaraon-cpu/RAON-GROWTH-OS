import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message || 'Instruções de recuperação enviadas com sucesso.',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Não foi possível enviar o e-mail de recuperação.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recuperação de Senha
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Receba um link seguro para redefinir seu acesso.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500' 
              : 'bg-red-500/10 border border-red-500/30 text-red-500'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              E-mail cadastrado
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="seuemail@empresa.com.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#345CF3]/20 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Link de Redefinição'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
