import React, { useState } from 'react';
import { 
  Store, Building2, Phone, FileText, ArrowRight, 
  CheckCircle2, Sparkles, Shield, Tag, Shirt, 
  Sparkle, Smartphone, ShoppingBag, Layers, Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ColorThemePicker } from '../../components/common/ColorThemePicker';

interface OnboardingViewProps {
  onComplete: () => void;
}

const SEGMENTS = [
  { id: 'Moda & Roupas', label: 'Moda & Roupas', icon: Shirt, desc: 'Boutiques, vestuário feminino, masculino e infantil' },
  { id: 'Calçados & Acessórios', label: 'Calçados & Acessórios', icon: ShoppingBag, desc: 'Sapatos, bolsas, cintos e bijuterias' },
  { id: 'Cosméticos & Perfumaria', label: 'Cosméticos & Perfumaria', icon: Sparkle, desc: 'Beleza, maquiagem, skincare e fragrâncias' },
  { id: 'Eletrônicos & Celulares', label: 'Eletrônicos & Celulares', icon: Smartphone, desc: 'Smartphones, gadgets e informática' },
  { id: 'Variedades & Presentes', label: 'Variedades & Presentes', icon: Layers, desc: 'Artigos para o lar, presentes e utilidades' },
  { id: 'Outros Comércios', label: 'Outros Comércios', icon: Store, desc: 'Outros estabelecimentos de comércio varejista' },
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const { currentUser, createTenant } = useAuth();
  const { colorThemeOption } = useTheme();

  const [companyName, setCompanyName] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('Moda & Roupas');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!companyName.trim()) {
      setErrorMsg('Por favor, informe o nome comercial da sua empresa.');
      return;
    }

    setIsSubmitting(true);
    const res = await createTenant({
      name: companyName.trim(),
      segment: selectedSegment,
      phone: phone.trim(),
      documentNumber: documentNumber.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      onComplete();
    } else {
      setErrorMsg(res.error || 'Erro ao criar empresa. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 sm:space-y-8">
        {/* Header / Stepper */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-app-light text-app-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Primeiro Acesso — Lucre+</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Olá, {currentUser?.fullName || 'Lojista'}! Vamos cadastrar sua empresa.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Você será configurado como o <strong>Proprietário</strong> com acesso irrestrito ao sistema no <strong>Plano Fixo Lucre+ (R$ 29,90/mês)</strong>.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Empresa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              1. Nome da Empresa / Nome Fantasia *
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="Ex: Bella Boutique ou Elegance Calçados"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden font-bold transition shadow-xs"
              />
            </div>
          </div>

          {/* Segmento Comercial */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              2. Segmento Comercial do Varejo *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SEGMENTS.map(seg => {
                const isSelected = selectedSegment === seg.id;
                const Icon = seg.icon;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => setSelectedSegment(seg.id)}
                    className={`p-3 rounded-2xl text-left border transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-app-light border-app-primary text-slate-900 dark:text-white shadow-xs ring-1 ring-app-primary'
                        : 'bg-slate-50 dark:bg-[#080B14] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-app-primary text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold block truncate">{seg.label}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{seg.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telefone e Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                3. Telefone Comercial / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="(71) 98303-2979"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                4. CNPJ ou CPF (Opcional agora)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Seletor de Cores da Empresa */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-app-primary" />
                <span>5. Cor Padrão do Sistema para sua Empresa</span>
              </label>
              <span className="text-[10px] text-app-primary font-bold">
                {colorThemeOption.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Escolha entre as 5 cores ou o tom padrão. Você poderá trocar a qualquer momento.
            </p>
            <ColorThemePicker layout="row" showLabels={true} />
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[#17B897] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plano Fixo Lucre+ R$ 29,90/mês • 14 dias grátis</span>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-app-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Criando empresa...' : 'Criar Empresa & Entrar no Lucre+'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
