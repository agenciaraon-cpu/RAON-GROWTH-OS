import React, { useState } from 'react';
import { 
  Store, Building2, Phone, Mail, FileText, 
  MapPin, Check, ShieldCheck, Palette, Clock, 
  DollarSign, AlertCircle, CheckCircle2, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ColorThemePicker } from '../../components/common/ColorThemePicker';

export const CompanySettingsView: React.FC = () => {
  const { currentTenant, updateTenant, currentMemberRole, hasRole } = useAuth();

  const isAuthorized = hasRole(['owner', 'manager']);

  const [name, setName] = useState(currentTenant?.name || '');
  const [legalName, setLegalName] = useState(currentTenant?.legalName || '');
  const [documentNumber, setDocumentNumber] = useState(currentTenant?.documentNumber || '');
  const [phone, setPhone] = useState(currentTenant?.phone || '');
  const [email, setEmail] = useState(currentTenant?.email || '');
  const [segment, setSegment] = useState(currentTenant?.segment || 'Moda & Roupas');
  
  // Settings & feedback
  const [timezone, setTimezone] = useState('America/Bahia');
  const [currency, setCurrency] = useState('BRL (R$)');
  const [accentColor, setAccentColor] = useState('#345CF3');
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!currentTenant) {
    return (
      <div className="p-8 text-center text-slate-500">
        Nenhuma empresa selecionada.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isAuthorized) {
      setErrorMessage('Apenas o Proprietário ou Gerente possuem permissão para alterar os dados da empresa.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('O nome da empresa é obrigatório.');
      return;
    }

    setIsSaving(true);
    try {
      await updateTenant(currentTenant.id, {
        name: name.trim(),
        legalName: legalName.trim(),
        documentNumber: documentNumber.trim(),
        phone: phone.trim(),
        email: email.trim(),
        segment,
      });

      setSuccessMessage('Configurações da empresa salvas com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Configurações da Empresa
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Informações cadastrais, fiscais, fuso horário e personalização de marca.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            isAuthorized 
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
          }`}>
            {isAuthorized ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isAuthorized ? 'Permissão de Edição Liberada' : 'Apenas Leitura'}</span>
          </span>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Informações Cadastrais */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-[#345CF3]" />
              <span>Identificação Comercial</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Nome fantasia, razão social e segmento do varejo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome Fantasia da Empresa *
              </label>
              <input
                type="text"
                required
                disabled={!isAuthorized}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-bold transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Razão Social
              </label>
              <input
                type="text"
                disabled={!isAuthorized}
                placeholder="Ex: Razão Social da Empresa LTDA"
                value={legalName}
                onChange={e => setLegalName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                CNPJ ou CPF (Documento Fiscal)
              </label>
              <input
                type="text"
                disabled={!isAuthorized}
                placeholder="00.000.000/0000-00"
                value={documentNumber}
                onChange={e => setDocumentNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Segmento Comercial do Varejo
              </label>
              <select
                disabled={!isAuthorized}
                value={segment}
                onChange={e => setSegment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-[#345CF3] outline-hidden font-semibold transition disabled:opacity-60"
              >
                <option value="Moda & Roupas">Moda & Roupas</option>
                <option value="Calçados & Acessórios">Calçados & Acessórios</option>
                <option value="Cosméticos & Perfumaria">Cosméticos & Perfumaria</option>
                <option value="Eletrônicos & Celulares">Eletrônicos & Celulares</option>
                <option value="Variedades & Presentes">Variedades & Presentes</option>
                <option value="Outros Comércios">Outros Comércios</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Contato Comercial */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#17B897]" />
              <span>Canais de Comunicação</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Telefone e e-mail exibidos nos recibos e pedidos aos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefone Comercial / WhatsApp
              </label>
              <input
                type="text"
                disabled={!isAuthorized}
                placeholder="(71) 98303-2979"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <input
                type="email"
                disabled={!isAuthorized}
                placeholder="contato@empresa.com.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden transition disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* 3. Regionalização & Fuso Horário */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8065E9]" />
              <span>Configuração Regional & Moeda</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Padrões para cálculo de fechamento de caixa e faturamento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Fuso Horário Padrão da Empresa
              </label>
              <select
                disabled={!isAuthorized}
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-[#345CF3] outline-hidden font-mono transition disabled:opacity-60"
              >
                <option value="America/Bahia">America/Bahia (UTC-3 - Padrão RAON)</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo (UTC-3)</option>
                <option value="America/Recife">America/Recife (UTC-3)</option>
                <option value="America/Fortaleza">America/Fortaleza (UTC-3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Moeda do Sistema
              </label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 4. Identidade Visual & Cores do Varejou */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-app-primary" />
              <span>Cor Padrão do Varejou para a Loja</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Alterne entre as 5 cores principais (Verde Escuro, Rosa Choque, Preto, Laranja Ouro, Roxo) ou a cor padrão para personalizar a experiência de toda a equipe
            </p>
          </div>

          <ColorThemePicker layout="grid" showLabels={true} />
        </div>

        {/* Action Button */}
        {isAuthorized && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#345CF3]/20 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Dados da Empresa'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
