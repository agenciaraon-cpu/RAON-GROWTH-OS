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
    uid: 'user-thiago-pinheiro',
    email: 'agenciaraon@gmail.com',
    name: 'Thiago Pinheiro',
    role: 'super_admin',
    currentOrganizationId: 'org-raon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '(71) 98303-2979',
    createdAt: '2025-01-01T00:00:00Z',
  },
  client_admin: {
    uid: 'user-client-1',
    email: 'cliente@agenciaraon.com.br',
    name: 'Cliente da Agência',
    role: 'client_admin',
    currentOrganizationId: 'org-raon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '(71) 98303-2979',
    createdAt: '2025-03-01T00:00:00Z',
  },
  sales_user: {
    uid: 'user-sales-1',
    email: 'comercial@agenciaraon.com.br',
    name: 'Comercial RAON',
    role: 'sales_user',
    currentOrganizationId: 'org-raon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '(71) 98303-2979',
    createdAt: '2025-03-15T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return 'super_admin';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return DEFAULT_USERS.super_admin;
  });

  const [organizations, setOrganizations] = useState<Organization[]>(DEMO_ORGS);
  
  const [currentOrgId, setCurrentOrgId] = useState<string>(() => {
    localStorage.setItem('raon_org_id', 'org-raon');
    return 'org-raon';
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const currentOrg = organizations.find(o => o.id === currentOrgId) || organizations[0] || DEMO_ORGS[0];

  useEffect(() => {
    localStorage.setItem('raon_role', 'super_admin');
    localStorage.setItem('raon_org_id', 'org-raon');
    localStorage.setItem('raon_demo_mode', 'false');
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const newUser = { ...DEFAULT_USERS[role] };
    setCurrentUser(newUser);
    setCurrentOrgId('org-raon');
  };

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId('org-raon');
    setCurrentUser(prev => ({ ...prev, currentOrganizationId: 'org-raon' }));
  };

  const login = (email: string, role: UserRole = 'super_admin') => {
    setCurrentRole('super_admin');
    setCurrentUser({
      ...DEFAULT_USERS.super_admin,
      email: email || 'agenciaraon@gmail.com',
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
