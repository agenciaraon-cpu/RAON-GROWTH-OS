import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Profile, Tenant, TenantMember, RoleCode, 
  TenantSettings, TenantInvitation, AuditLog 
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  isSandboxMode: boolean;
  currentUser: Profile | null;
  currentTenant: Tenant | null;
  userTenants: Tenant[];
  currentMemberRole: RoleCode | null;
  tenantMembers: TenantMember[];
  tenantSettings: TenantSettings | null;
  isPlatformAdmin: boolean;
  invitations: TenantInvitation[];

  // Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string | null }) => Promise<void>;
  createTenant: (data: { name: string; segment: string; phone?: string; documentNumber?: string }) => Promise<{ success: boolean; tenantId?: string; error?: string }>;
  switchTenant: (tenantId: string) => void;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  updateTenantSettings: (settings: Partial<TenantSettings>) => Promise<void>;
  inviteMember: (email: string, roleCode: RoleCode) => Promise<{ success: boolean; error?: string }>;
  updateMemberRole: (memberId: string, roleCode: RoleCode) => Promise<{ success: boolean; error?: string }>;
  removeMember: (memberId: string) => Promise<{ success: boolean; error?: string }>;
  hasRole: (roles: RoleCode | RoleCode[]) => boolean;
  setSandboxMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Sandbox Mock Data (Separado, isolado e identificado)
const SANDBOX_PROFILES: Profile[] = [
  {
    id: 'user-thiago-raon',
    email: 'agenciaraon@gmail.com',
    fullName: 'Thiago Pinheiro',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '(71) 98303-2979',
    isPlatformAdmin: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'user-mateus-lima',
    email: 'mateus.lima@raonsystem.com.br',
    fullName: 'Mateus Lima',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    phone: '(71) 98303-2979',
    isPlatformAdmin: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-gabriela-alencar',
    email: 'gabriela.alencar@raonsystem.com.br',
    fullName: 'Gabriela Alencar',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    phone: '(71) 98303-2979',
    isPlatformAdmin: false,
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
  },
];

const SANDBOX_TENANTS: Tenant[] = [
  {
    id: 'tenant-loja-1',
    name: 'Moda Elegance Varejo',
    slug: 'moda-elegance',
    legalName: 'Elegance Vestuário e Calçados LTDA',
    documentNumber: '12.345.678/0001-90',
    email: 'contato@modaelegance.com.br',
    phone: '(71) 98303-2979',
    segment: 'Moda & Vestuário',
    status: 'active',
    logoUrl: null,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'tenant-loja-2',
    name: 'Bella Cosméticos & Perfumaria',
    slug: 'bella-cosmeticos',
    legalName: 'Bella Beleza & Bem-Estar EIRELI',
    documentNumber: '28.901.234/0001-55',
    email: 'gerencia@bellacosmeticos.com.br',
    phone: '(75) 99105-5716',
    segment: 'Cosméticos & Beleza',
    status: 'active',
    logoUrl: null,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
  },
];

const ROLE_NAMES: Record<RoleCode, string> = {
  owner: 'Proprietário',
  manager: 'Gerente',
  cashier: 'Operador de Caixa',
  sales: 'Vendedor',
  stock: 'Estoquista',
  financial: 'Financeiro',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSandboxMode, setIsSandboxModeState] = useState<boolean>(() => {
    return !isSupabaseConfigured;
  });

  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('raon_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userTenants, setUserTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('raon_tenants');
    return saved ? JSON.parse(saved) : SANDBOX_TENANTS;
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    return localStorage.getItem('raon_current_tenant_id') || 'tenant-loja-1';
  });

  const [tenantMembers, setTenantMembers] = useState<TenantMember[]>(() => {
    const saved = localStorage.getItem('raon_tenant_members');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'tm-1',
        tenantId: 'tenant-loja-1',
        userId: 'user-thiago-raon',
        roleId: 'role-owner',
        roleCode: 'owner',
        roleName: 'Proprietário',
        status: 'active',
        userName: 'Thiago Pinheiro',
        userEmail: 'agenciaraon@gmail.com',
        userPhone: '(71) 98303-2979',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        createdAt: '2025-01-01T10:00:00Z',
      },
      {
        id: 'tm-2',
        tenantId: 'tenant-loja-1',
        userId: 'user-mateus-lima',
        roleId: 'role-manager',
        roleCode: 'manager',
        roleName: 'Gerente',
        status: 'active',
        userName: 'Mateus Lima',
        userEmail: 'mateus.lima@raonsystem.com.br',
        userPhone: '(71) 98303-2979',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        createdAt: '2025-01-15T10:00:00Z',
      },
      {
        id: 'tm-3',
        tenantId: 'tenant-loja-1',
        userId: 'user-gabriela-alencar',
        roleId: 'role-financial',
        roleCode: 'financial',
        roleName: 'Financeiro',
        status: 'active',
        userName: 'Gabriela Alencar',
        userEmail: 'gabriela.alencar@raonsystem.com.br',
        userPhone: '(71) 98303-2979',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        createdAt: '2025-02-01T10:00:00Z',
      },
    ];
  });

  const [invitations, setInvitations] = useState<TenantInvitation[]>(() => {
    const saved = localStorage.getItem('raon_invitations');
    return saved ? JSON.parse(saved) : [];
  });

  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(() => {
    const saved = localStorage.getItem(`raon_settings_${currentTenantId}`);
    if (saved) return JSON.parse(saved);

    return {
      tenantId: currentTenantId,
      theme: 'system',
      accentColor: '#345CF3',
      timezone: 'America/Bahia',
      currency: 'BRL',
      address: {
        city: 'Salvador',
        state: 'BA',
        neighborhood: 'Pituba',
      },
      updatedAt: new Date().toISOString(),
    };
  });

  // Current active tenant
  const currentTenant = userTenants.find(t => t.id === currentTenantId) || userTenants[0] || null;

  // Current user's role in this tenant
  const currentMembership = tenantMembers.find(
    m => m.tenantId === currentTenant?.id && m.userId === currentUser?.id && m.status === 'active'
  );
  const currentMemberRole: RoleCode | null = currentMembership ? currentMembership.roleCode : (currentUser?.isPlatformAdmin ? 'owner' : null);

  const isPlatformAdmin = Boolean(currentUser?.isPlatformAdmin);

  // Sync state to local storage for Sandbox/Offline persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('raon_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('raon_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('raon_tenants', JSON.stringify(userTenants));
  }, [userTenants]);

  useEffect(() => {
    localStorage.setItem('raon_current_tenant_id', currentTenantId);
  }, [currentTenantId]);

  useEffect(() => {
    localStorage.setItem('raon_tenant_members', JSON.stringify(tenantMembers));
  }, [tenantMembers]);

  useEffect(() => {
    localStorage.setItem('raon_invitations', JSON.stringify(invitations));
  }, [invitations]);

  // Initial Auth Check
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setCurrentUser({
                id: profile.id,
                email: session.user.email || '',
                fullName: profile.full_name,
                avatarUrl: profile.avatar_path,
                phone: profile.phone,
                isPlatformAdmin: profile.is_platform_admin,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at,
              });
            }
          }
        } catch (err) {
          console.warn('Supabase session load error:', err);
        }
      } else {
        // If not using live supabase, fallback to default sandbox user if none saved
        if (!currentUser) {
          setCurrentUser(SANDBOX_PROFILES[0]);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || '12345678',
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setCurrentUser({
              id: profile.id,
              email: data.user.email || '',
              fullName: profile.full_name,
              avatarUrl: profile.avatar_path,
              phone: profile.phone,
              isPlatformAdmin: profile.is_platform_admin,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            });
          }
        }

        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Falha ao autenticar no Supabase' };
      }
    }

    // Sandbox / Demo login
    await new Promise(r => setTimeout(r, 400));
    const matchedProfile = SANDBOX_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      avatarUrl: null,
      phone: '(71) 98303-2979',
      isPlatformAdmin: email.includes('admin') || email.includes('raon'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(matchedProfile);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (fullName: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || '12345678',
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          setCurrentUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName,
            avatarUrl: null,
            phone: null,
            isPlatformAdmin: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Erro ao cadastrar usuário' };
      }
    }

    // Sandbox Registration
    await new Promise(r => setTimeout(r, 400));
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      avatarUrl: null,
      phone: null,
      isPlatformAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(newProfile);
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Link de recuperação enviado com sucesso!' };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { 
      success: true, 
      message: `Link simulado de recuperação de senha enviado para ${email}. Verifique sua caixa de entrada.` 
    };
  };

  const updateProfile = async (data: { fullName?: string; phone?: string; avatarUrl?: string | null }) => {
    if (!currentUser) return;

    const updated: Profile = {
      ...currentUser,
      fullName: data.fullName !== undefined ? data.fullName : currentUser.fullName,
      phone: data.phone !== undefined ? data.phone : currentUser.phone,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : currentUser.avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.fullName,
            phone: updated.phone,
            avatar_path: updated.avatarUrl,
            updated_at: updated.updatedAt,
          })
          .eq('id', currentUser.id);
      } catch (e) {}
    }

    setCurrentUser(updated);

    // Also update in tenantMembers list if present
    setTenantMembers(prev => prev.map(m => {
      if (m.userId === currentUser.id) {
        return {
          ...m,
          userName: updated.fullName,
          userPhone: updated.phone || undefined,
          avatarUrl: updated.avatarUrl || undefined,
        };
      }
      return m;
    }));
  };

  const createTenant = async (data: { name: string; segment: string; phone?: string; documentNumber?: string }) => {
    if (!currentUser) return { success: false, error: 'Usuário não autenticado' };

    const newSlug = data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTenantId = `tenant-${Date.now()}`;

    const newTenant: Tenant = {
      id: newTenantId,
      name: data.name,
      slug: newSlug,
      legalName: data.name,
      documentNumber: data.documentNumber || '',
      phone: data.phone || currentUser.phone || '',
      email: currentUser.email,
      segment: data.segment || 'Varejo Geral',
      status: 'active',
      logoUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newMembership: TenantMember = {
      id: `tm-${Date.now()}`,
      tenantId: newTenantId,
      userId: currentUser.id,
      roleId: 'role-owner',
      roleCode: 'owner',
      roleName: 'Proprietário',
      status: 'active',
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userPhone: currentUser.phone || undefined,
      avatarUrl: currentUser.avatarUrl || undefined,
      createdAt: new Date().toISOString(),
    };

    setUserTenants(prev => [...prev, newTenant]);
    setTenantMembers(prev => [...prev, newMembership]);
    setCurrentTenantId(newTenantId);

    return { success: true, tenantId: newTenantId };
  };

  const switchTenant = (tenantId: string) => {
    const exists = userTenants.some(t => t.id === tenantId);
    if (exists || currentUser?.isPlatformAdmin) {
      setCurrentTenantId(tenantId);
    }
  };

  const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    setUserTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return { ...t, ...updates, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
  };

  const updateTenantSettings = async (settings: Partial<TenantSettings>) => {
    if (!currentTenant) return;
    setTenantSettings(prev => {
      const updated = {
        tenantId: currentTenant.id,
        theme: settings.theme || prev?.theme || 'system',
        accentColor: settings.accentColor || prev?.accentColor || '#345CF3',
        timezone: settings.timezone || prev?.timezone || 'America/Bahia',
        currency: settings.currency || prev?.currency || 'BRL',
        address: { ...prev?.address, ...settings.address },
        businessSettings: { ...prev?.businessSettings, ...settings.businessSettings },
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`raon_settings_${currentTenant.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const inviteMember = async (email: string, roleCode: RoleCode) => {
    if (!currentTenant) return { success: false, error: 'Nenhuma empresa selecionada' };
    
    // Check if already in tenant
    const alreadyMember = tenantMembers.some(
      m => m.tenantId === currentTenant.id && m.userEmail.toLowerCase() === email.toLowerCase() && m.status === 'active'
    );
    if (alreadyMember) {
      return { success: false, error: 'Este e-mail já é membro desta empresa.' };
    }

    const newInvitation: TenantInvitation = {
      id: `inv-${Date.now()}`,
      tenantId: currentTenant.id,
      email,
      roleId: `role-${roleCode}`,
      roleCode,
      roleName: ROLE_NAMES[roleCode],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setInvitations(prev => [...prev, newInvitation]);

    // Also add to tenant members as 'invited' for clear management visibility
    const newMemberRecord: TenantMember = {
      id: `tm-${Date.now()}`,
      tenantId: currentTenant.id,
      userId: `user-invited-${Date.now()}`,
      roleId: `role-${roleCode}`,
      roleCode,
      roleName: ROLE_NAMES[roleCode],
      status: 'invited',
      userName: email.split('@')[0],
      userEmail: email,
      createdAt: new Date().toISOString(),
    };

    setTenantMembers(prev => [...prev, newMemberRecord]);

    return { success: true };
  };

  const updateMemberRole = async (memberId: string, roleCode: RoleCode) => {
    const member = tenantMembers.find(m => m.id === memberId);
    if (!member) return { success: false, error: 'Membro não encontrado' };

    // Prevent changing self to non-owner if sole owner
    if (member.userId === currentUser?.id && member.roleCode === 'owner' && roleCode !== 'owner') {
      const activeOwners = tenantMembers.filter(
        m => m.tenantId === member.tenantId && m.roleCode === 'owner' && m.status === 'active'
      );
      if (activeOwners.length <= 1) {
        return { 
          success: false, 
          error: 'A empresa precisa ter pelo menos um Proprietário ativo. Transfira a propriedade antes de alterar seu papel.' 
        };
      }
    }

    setTenantMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          roleCode,
          roleName: ROLE_NAMES[roleCode],
        };
      }
      return m;
    }));

    return { success: true };
  };

  const removeMember = async (memberId: string) => {
    const member = tenantMembers.find(m => m.id === memberId);
    if (!member) return { success: false, error: 'Membro não encontrado' };

    // Prevent removing the sole owner
    if (member.roleCode === 'owner') {
      const activeOwners = tenantMembers.filter(
        m => m.tenantId === member.tenantId && m.roleCode === 'owner' && m.status === 'active'
      );
      if (activeOwners.length <= 1) {
        return { 
          success: false, 
          error: 'Não é possível remover o único Proprietário da empresa. Transfira a titularidade primeiro.' 
        };
      }
    }

    setTenantMembers(prev => prev.filter(m => m.id !== memberId));
    return { success: true };
  };

  const hasRole = (roles: RoleCode | RoleCode[]) => {
    if (currentUser?.isPlatformAdmin) return true;
    if (!currentMemberRole) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentMemberRole);
    }
    return currentMemberRole === roles;
  };

  const setSandboxMode = (enabled: boolean) => {
    setIsSandboxModeState(enabled);
  };

  const currentTenantMembers = tenantMembers.filter(m => m.tenantId === currentTenant?.id);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(currentUser),
        isLoading,
        isSandboxMode,
        currentUser,
        currentTenant,
        userTenants,
        currentMemberRole,
        tenantMembers: currentTenantMembers,
        tenantSettings,
        isPlatformAdmin,
        invitations: invitations.filter(i => i.tenantId === currentTenant?.id),
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        createTenant,
        switchTenant,
        updateTenant,
        updateTenantSettings,
        inviteMember,
        updateMemberRole,
        removeMember,
        hasRole,
        setSandboxMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
