import React, { useState } from 'react';
import { X, Store, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTenantModal: React.FC<CreateTenantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createTenant } = useAuth();

  const [name, setName] = useState('');
  const [segment, setSegment] = useState('Moda & Roupas');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Informe o nome da empresa.');
      return;
    }

    setIsSubmitting(true);
    const res = await createTenant({
      name: name.trim(),
      segment,
      phone: phone.trim() || undefined,
      documentNumber: documentNumber.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Erro ao criar empresa.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cadastrar Nova Empresa
              </h3>
              <p className="text-[11px] text-slate-400">
                Os dados desta empresa serão 100% isolados por tenant_id.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nome da Empresa / Nome Fantasia *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Prime Calçados"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Segmento Comercial *
            </label>
            <select
              value={segment}
              onChange={e => setSegment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-[#345CF3] outline-hidden font-medium"
            >
              <option value="Moda & Roupas">Moda & Roupas</option>
              <option value="Calçados & Acessórios">Calçados & Acessórios</option>
              <option value="Cosméticos & Perfumaria">Cosméticos & Perfumaria</option>
              <option value="Eletrônicos & Celulares">Eletrônicos & Celulares</option>
              <option value="Variedades & Presentes">Variedades & Presentes</option>
              <option value="Outros Comércios">Outros Comércios</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Telefone / WhatsApp Comercial
            </label>
            <input
              type="text"
              placeholder="(71) 98303-2979"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
              className="px-5 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition shadow-md shadow-[#345CF3]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Criando...' : 'Cadastrar Empresa'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
