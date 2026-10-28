import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export type AppColorId = 
  | 'default'       // Azul Digital (Padrão)
  | 'verde_escuro'  // Verde Escuro
  | 'rosa_choque'   // Rosa Choque
  | 'preto'         // Preto
  | 'laranja_ouro'  // Laranja Ouro
  | 'roxo';         // Roxo

export interface ColorThemeOption {
  id: AppColorId;
  name: string;
  description: string;
  hex: string;
  hoverHex: string;
  lightBgHex: string;
  gradientFrom: string;
  gradientTo: string;
  borderHex: string;
  glowRgba: string;
}

export const APP_COLOR_OPTIONS: ColorThemeOption[] = [
  {
    id: 'default',
    name: 'Azul Digital (Padrão)',
    description: 'Cor padrão oficial Lucre+',
    hex: '#345CF3',
    hoverHex: '#254ADB',
    lightBgHex: 'rgba(52, 92, 243, 0.12)',
    gradientFrom: '#345CF3',
    gradientTo: '#8065E9',
    borderHex: '#345CF3',
    glowRgba: 'rgba(52, 92, 243, 0.35)',
  },
  {
    id: 'verde_escuro',
    name: 'Verde Escuro',
    description: 'Esmeralda nobre & prosperidade comercial',
    hex: '#065F46',
    hoverHex: '#044E39',
    lightBgHex: 'rgba(6, 95, 70, 0.15)',
    gradientFrom: '#065F46',
    gradientTo: '#10B981',
    borderHex: '#047857',
    glowRgba: 'rgba(6, 95, 70, 0.4)',
  },
  {
    id: 'rosa_choque',
    name: 'Rosa Choque',
    description: 'Vibrante, moderno & moda varejo',
    hex: '#E11D48',
    hoverHex: '#BE123C',
    lightBgHex: 'rgba(225, 29, 72, 0.15)',
    gradientFrom: '#E11D48',
    gradientTo: '#F43F5E',
    borderHex: '#E11D48',
    glowRgba: 'rgba(225, 29, 72, 0.4)',
  },
  {
    id: 'preto',
    name: 'Preto',
    description: 'Minimalismo luxo & acabamento titânio',
    hex: '#18181B',
    hoverHex: '#09090B',
    lightBgHex: 'rgba(24, 24, 27, 0.15)',
    gradientFrom: '#18181B',
    gradientTo: '#3F3F46',
    borderHex: '#3F3F46',
    glowRgba: 'rgba(24, 24, 27, 0.5)',
  },
  {
    id: 'laranja_ouro',
    name: 'Laranja Ouro',
    description: 'Dourado âmbar, energia de vendas & lucro',
    hex: '#D97706',
    hoverHex: '#B45309',
    lightBgHex: 'rgba(217, 119, 6, 0.15)',
    gradientFrom: '#D97706',
    gradientTo: '#F59E0B',
    borderHex: '#D97706',
    glowRgba: 'rgba(217, 119, 6, 0.4)',
  },
  {
    id: 'roxo',
    name: 'Roxo',
    description: 'Violeta imperial & sofisticação digital',
    hex: '#7C3AED',
    hoverHex: '#6D28D9',
    lightBgHex: 'rgba(124, 58, 237, 0.15)',
    gradientFrom: '#7C3AED',
    gradientTo: '#A78BFA',
    borderHex: '#7C3AED',
    glowRgba: 'rgba(124, 58, 237, 0.4)',
  },
];

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colorTheme: AppColorId;
  colorThemeOption: ColorThemeOption;
  setColorTheme: (colorId: AppColorId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('lucre_theme') || localStorage.getItem('raon_theme');
    return (saved as Theme) || 'dark';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');

  const [colorTheme, setColorThemeState] = useState<AppColorId>(() => {
    const saved = localStorage.getItem('lucre_color_theme');
    const valid = APP_COLOR_OPTIONS.find(c => c.id === saved);
    return valid ? (saved as AppColorId) : 'default';
  });

  const colorThemeOption = APP_COLOR_OPTIONS.find(c => c.id === colorTheme) || APP_COLOR_OPTIONS[0];

  // Apply Light/Dark class to HTML root
  useEffect(() => {
    const root = window.document.documentElement;
    let computedTheme: 'light' | 'dark' = 'dark';

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      computedTheme = prefersDark ? 'dark' : 'light';
    } else {
      computedTheme = theme;
    }

    setEffectiveTheme(computedTheme);

    if (computedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    localStorage.setItem('lucre_theme', theme);
  }, [theme]);

  // Apply CSS Variables for Color Palette
  useEffect(() => {
    const root = window.document.documentElement;
    const option = colorThemeOption;

    root.style.setProperty('--app-primary', option.hex);
    root.style.setProperty('--app-primary-hover', option.hoverHex);
    root.style.setProperty('--app-primary-light', option.lightBgHex);
    root.style.setProperty('--app-gradient-from', option.gradientFrom);
    root.style.setProperty('--app-gradient-to', option.gradientTo);
    root.style.setProperty('--app-border', option.borderHex);
    root.style.setProperty('--app-glow', option.glowRgba);

    localStorage.setItem('lucre_color_theme', colorTheme);
  }, [colorTheme, colorThemeOption]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setColorTheme = (colorId: AppColorId) => {
    setColorThemeState(colorId);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      effectiveTheme, 
      setTheme, 
      toggleTheme,
      colorTheme,
      colorThemeOption,
      setColorTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
