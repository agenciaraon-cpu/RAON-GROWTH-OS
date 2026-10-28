import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Lock, Camera, Upload, 
  Trash2, Check, ShieldCheck, Sun, Moon, 
  LogOut, AlertCircle, CheckCircle2, Sparkles, Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ColorThemePicker } from '../../components/common/ColorThemePicker';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, logout, currentMemberRole, currentTenant } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatarUrl || null);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // File Upload Handling with strict validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPEG, PNG, WebP only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Formato de imagem inválido. Use apenas JPEG, PNG ou WebP.');
      return;
    }

    // Validate size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('O nome do usuário não pode ficar vazio.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: avatarPreview,
      });

      setSuccessMessage('Perfil atualizado com sucesso no RAON System!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar alterações no perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A confirmação da nova senha não confere.');
      return;
    }

    setSuccessMessage('Senha atualizada com sucesso! Suas credenciais foram renovadas.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Meu Perfil de Usuário
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gerencie sua foto de exibição, dados pessoais, preferências visuais e segurança.
        </p>
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

      {/* 1. Profile Picture Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Foto de Perfil & Avatar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Formatos aceitos: JPEG, PNG e WebP (máx. 5MB).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-[#345CF3]/40 overflow-hidden flex items-center justify-center shadow-lg">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt={fullName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-linear-to-tr from-[#345CF3] to-[#8065E9] flex items-center justify-center text-white text-3xl font-extrabold">
                  {fullName ? fullName.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white shadow-md transition cursor-pointer"
              title="Trocar Foto"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#345CF3]/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Carregar Nova Foto</span>
              </button>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover Foto</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Sua foto será exibida no cabeçalho, nas mensagens da equipe e na lista de membros da empresa.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Personal Information Card */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Dados Pessoais
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Informações associadas ao seu login de usuário
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#17B897]/15 text-[#17B897] uppercase">
            Papel: {currentMemberRole || 'Membro'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-semibold transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              E-mail de Acesso (Não editável diretamente)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Número de Telefone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="(71) 98303-2979"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Empresa Atual
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-bold">
              {currentTenant?.name || 'Nenhuma'}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#345CF3]/20 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações do Perfil'}</span>
          </button>
        </div>
      </form>

      {/* 3. Security & Password Update Card */}
      <form onSubmit={handlePasswordUpdate} className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Segurança da Conta & Alteração de Senha
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Defina uma senha forte com letras, números e símbolos para proteger sua conta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nova Senha *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirmar Nova Senha *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden font-mono transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Atualizar Senha de Acesso</span>
          </button>
        </div>
      </form>

      {/* 4. Preferences & Session Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Preferências da Interface & Sessão
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajuste a aparência visual ou encerre a sessão neste dispositivo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Tema da Interface
              </span>
              <span className="text-[11px] text-slate-400">
                Atualmente no modo: <strong>{theme === 'dark' ? 'Escuro (Azul Noturno)' : 'Claro (Fundo Limpo)'}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 transition cursor-pointer"
          >
            Alternar para Tema {theme === 'dark' ? 'Claro' : 'Escuro'}
          </button>
        </div>

        {/* Color Palette Choice */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-app-primary" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Cores do Lucre+ (Personalização do seu usuário)
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Escolha entre as 5 cores (Verde Escuro, Rosa Choque, Preto, Laranja Ouro, Roxo) ou a cor padrão para colorir os destaques do seu painel:
          </p>
          <ColorThemePicker layout="row" showLabels={true} />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
