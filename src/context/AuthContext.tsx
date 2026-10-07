import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Organization } from '../types';
import { DEMO_ORGS } from '../data/demoData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  currentOrg: Organization;
  organizations: Organization[];
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  switchRole: (role: UserRole) => void;
  switchOrganization: (orgId: string) => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  super_admin: {
    uid: 'user-super-1',
    email: 'agenciaraon@gmail.com',
    name: 'Felipe Rocha (RAON HQ)',
    role: 'super_admin',
    currentOrganizationId: 'org-raon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 99876-5432',
    createdAt: '2025-01-01T00:00:00Z',
  },
  client_admin: {
    uid: 'user-client-1',
    email: 'diretoria@alphaimoveis.com.br',
    name: 'Marcos Valente (Diretor)',
    role: 'client_admin',
    currentOrganizationId: 'org-alpha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 98765-4321',
    createdAt: '2025-03-01T00:00:00Z',
  },
  sales_user: {
    uid: 'user-sales-1',
    email: 'roberto.lima@alphaimoveis.com.br',
    name: 'Roberto Lima (SDR / Vendas)',
    role: 'sales_user',
    currentOrganizationId: 'org-alpha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 97654-3210',
    createdAt: '2025-03-15T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('raon_role');
    return (saved as UserRole) || 'super_admin';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return DEFAULT_USERS[currentRole] || DEFAULT_USERS.super_admin;
  });

  const [organizations, setOrganizations] = useState<Organization[]>(DEMO_ORGS);
  
  const [currentOrgId, setCurrentOrgId] = useState<string>(() => {
    const saved = localStorage.getItem('raon_org_id');
    return saved || 'org-raon';
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('raon_demo_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const currentOrg = organizations.find(o => o.id === currentOrgId) || organizations[0];

  useEffect(() => {
    localStorage.setItem('raon_role', currentRole);
    localStorage.setItem('raon_org_id', currentOrgId);
    localStorage.setItem('raon_demo_mode', String(isDemoMode));
  }, [currentRole, currentOrgId, isDemoMode]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const newUser = { ...DEFAULT_USERS[role] };
    setCurrentUser(newUser);
    if (role !== 'super_admin') {
      setCurrentOrgId('org-alpha');
    }
  };

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId(orgId);
    setCurrentUser(prev => ({ ...prev, currentOrganizationId: orgId }));
  };

  const login = (email: string, role: UserRole = 'super_admin') => {
    setCurrentRole(role);
    setCurrentUser({
      uid: 'user-' + Date.now(),
      email,
      name: email.split('@')[0],
      role,
      currentOrganizationId: role === 'super_admin' ? 'org-raon' : 'org-alpha',
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    switchRole('super_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        currentOrg,
        organizations,
        isDemoMode,
        setIsDemoMode,
        switchRole,
        switchOrganization,
        login,
        logout,
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
