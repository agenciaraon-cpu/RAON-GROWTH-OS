import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Sun, Moon, Store, Plus, 
  ChevronDown, Check, User, Settings, LogOut, 
  ShieldAlert, Database, Sparkles, ExternalLink, X, Palette, Link
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ColorThemePicker } from '../common/ColorThemePicker';
import { AppNavigationRoute } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';

interface HeaderProps {
  collapsed: boolean;
  currentRoute: AppNavigationRoute;
  onRouteChange: (route: AppNavigationRoute) => void;
  onOpenCreateTenant: () => void;
  onOpenSupabaseAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  onRouteChange,
  onOpenCreateTenant,
  onOpenSupabaseAssistant,
}) => {
  const { 
    currentUser, 
    currentTenant, 
    userTenants, 
    switchTenant, 
    logout, 
    currentMemberRole,
    isPlatformAdmin 
  } = useAuth();
  
  const { theme, toggleTheme, colorThemeOption } = useTheme();

  // Dropdown states
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [copiedStoreLink, setCopiedStoreLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tenantMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tenantMenuRef.current && !tenantMenuRef.current.contains(e.target as Node)) {
        setIsTenantMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) {
        setIsColorMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: '1',
      title: 'Bem-vindo ao Varejou',
      description: 'Sua loja está ativa no ambiente seguro com isolamento multiempresa.',
      time: 'Hoje',
      type: 'success',
    },
    {
      id: '2',
      title: 'Plano Fixo Varejou R$ 29,90/mês',
      description: 'PDV, roupas/produtos, estoque, clientes e WhatsApp 100% liberados.',
      time: 'Hoje',
      type: 'info',
    },
  ];

  const handleCopyStoreRegistrationLink = () => {
    const url = `${window.location.origin}/?cadastro=loja`;
    navigator.clipboard.writeText(url);
    setCopiedStoreLink(true);
    setTimeout(() => setCopiedStoreLink(false), 3000);
  };

  return (
    <header 
      className={`fixed top-0 right-0 z-30 h-18 transition-all duration-300 ease-in-out border-b flex items-center justify-between px-6 bg-[#FFFFFF]/95 dark:bg-[#0B1225]/95 backdrop-blur-md border-slate-200 dark:border-slate-800/80 ${
        collapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Left: Tenant Selector & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {collapsed && (
          <div className="flex items-center gap-2 shrink-0">
            <img 
              src="/assets/aistudio/logovarejo_0f870eab.png" 
              alt="Varejou" 
              className="h-8 w-auto object-contain"
            />
          </div>
        )}

        {/* Tenant Selector */}
        <div className="relative" ref={tenantMenuRef}>
          <button
            onClick={() => setIsTenantMenuOpen(!isTenantMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition border border-slate-200 dark:border-slate-700/60 text-xs font-semibold cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-[#345CF3]/15 text-[#345CF3] flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {currentTenant ? currentTenant.name : 'Selecione a Loja'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Tenant Dropdown Menu */}
          {isTenantMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Suas Lojas / Empresas ({userTenants.length})
              </div>

              <div className="space-y-1 max-h-56 overflow-y-auto">
                {userTenants.map(t => {
                  const isSelected = t.id === currentTenant?.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setIsTenantMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#345CF3]/10 text-[#345CF3] font-bold border border-[#345CF3]/20'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-semibold">{t.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                          {t.segment}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#345CF3] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setIsTenantMenuOpen(false);
                    onOpenCreateTenant();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-[#345CF3] hover:bg-[#345CF3]/10 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Nova Loja</span>
                </button>
                <button
                  onClick={() => {
                    setIsTenantMenuOpen(false);
                    handleCopyStoreRegistrationLink();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-[#17B897] hover:bg-[#17B897]/10 transition cursor-pointer"
                >
                  <Link className="w-4 h-4" />
                  <span>Copiar Link p/ Lojista se Cadastrar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Copy Store Auto-registration Link (Quick Button) */}
        <button
          onClick={handleCopyStoreRegistrationLink}
          title="Copiar link para enviar ao cliente cadastrar a loja dele"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <Link className="w-3.5 h-3.5 text-[#345CF3]" />
          <span>{copiedStoreLink ? 'Link Copiado!' : 'Link de Cadastro de Lojas'}</span>
        </button>

        {/* Search Field */}
        <div className="relative flex-1 hidden lg:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar roupas, produtos, clientes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 border border-transparent focus:border-[#345CF3] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-hidden transition"
          />
        </div>
      </div>

      {/* Right Controls: Database Status (ADMIN ONLY), Theme, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Supabase Status / Assistant Button: ONLY visible to platform superadmin (Thiago Pinheiro) */}
        {isPlatformAdmin && (
          <button
            onClick={onOpenSupabaseAssistant}
            title="Painel Técnico Supabase (visível apenas para o SuperAdmin Thiago Pinheiro)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              isSupabaseConfigured
                ? 'bg-[#17B897]/10 text-[#17B897] border-[#17B897]/30 hover:bg-[#17B897]/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSupabaseConfigured ? 'Supabase Conectado' : 'Supabase (Configurar)'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-[#17B897]' : 'bg-amber-500'}`} />
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Color Palette Picker Button */}
        <div className="relative" ref={colorMenuRef}>
          <button
            onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center gap-1.5 cursor-pointer"
            title="Escolher cor do app Varejou (5 cores + padrão)"
          >
            <Palette className="w-4 h-4 text-app-primary" />
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-xs" 
              style={{ backgroundColor: colorThemeOption.hex }}
            />
          </button>

          {isColorMenuOpen && (
            <div className="absolute right-0 mt-2 w-84 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-app-primary" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Cores do Varejou
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {colorThemeOption.name}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Escolha a cor que melhor combina com a identidade visual da sua loja:
              </p>

              <ColorThemePicker layout="row" showLabels={true} />
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
            title="Central de Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#345CF3]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Notificações do Sistema
                </span>
                <span className="text-[10px] font-semibold text-[#345CF3] bg-[#345CF3]/10 px-2 py-0.5 rounded-full">
                  2 novas
                </span>
              </div>

              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {n.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.description}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#345CF3] to-[#8065E9] overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {currentUser?.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.fullName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>
                  {currentUser?.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'}
                </span>
              )}
            </div>

            <div className="text-left hidden lg:block">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate max-w-[130px]">
                {currentUser?.fullName || 'Usuário'}
              </span>
              <span className="text-[10px] font-semibold text-[#17B897] block uppercase tracking-wider">
                {currentMemberRole === 'owner' ? 'Proprietário' : currentMemberRole || 'Membro'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.fullName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#17B897]/15 text-[#17B897] border border-[#17B897]/30 uppercase">
                    {currentMemberRole || 'Colaborador'}
                  </span>
                  {isPlatformAdmin && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase">
                      Admin RAON
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onRouteChange('profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Meu Perfil</span>
                </button>

                <button
                  onClick={() => {
                    onRouteChange('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Configurações da Empresa</span>
                </button>

                {isPlatformAdmin && (
                  <button
                    onClick={() => {
                      onRouteChange('raon_admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition text-left"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Painel RAON Admin</span>
                  </button>
                )}
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
