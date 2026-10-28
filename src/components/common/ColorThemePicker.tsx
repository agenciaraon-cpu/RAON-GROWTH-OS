import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useTheme, APP_COLOR_OPTIONS, AppColorId } from '../../context/ThemeContext';

interface ColorThemePickerProps {
  layout?: 'grid' | 'row' | 'compact';
  showLabels?: boolean;
  onSelectColor?: (colorId: AppColorId) => void;
  className?: string;
}

export const ColorThemePicker: React.FC<ColorThemePickerProps> = ({
  layout = 'grid',
  showLabels = true,
  onSelectColor,
  className = '',
}) => {
  const { colorTheme, setColorTheme } = useTheme();

  const handleSelect = (id: AppColorId) => {
    setColorTheme(id);
    if (onSelectColor) {
      onSelectColor(id);
    }
  };

  if (layout === 'compact') {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {APP_COLOR_OPTIONS.map(opt => {
          const isSelected = colorTheme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              title={`${opt.name} — ${opt.description}`}
              className={`w-7 h-7 rounded-full transition-all flex items-center justify-center relative cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110 shadow-md' 
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: opt.hex,
                border: opt.id === 'preto' ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (layout === 'row') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 ${className}`}>
        {APP_COLOR_OPTIONS.map(opt => {
          const isSelected = colorTheme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center cursor-pointer ${
                isSelected
                  ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-md scale-102 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080B14] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition"
                style={{
                  background: `linear-gradient(135deg, ${opt.gradientFrom}, ${opt.gradientTo})`,
                  border: opt.id === 'preto' ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                )}
              </div>
              {showLabels && (
                <div className="w-full truncate">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 block truncate">
                    {opt.name}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
      {APP_COLOR_OPTIONS.map(opt => {
        const isSelected = colorTheme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              isSelected
                ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/90 shadow-md scale-101 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080B14] hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-md text-white transition"
              style={{
                background: `linear-gradient(135deg, ${opt.gradientFrom}, ${opt.gradientTo})`,
                border: opt.id === 'preto' ? '1px solid rgba(255,255,255,0.25)' : 'none',
                boxShadow: isSelected ? `0 4px 14px ${opt.glowRgba}` : 'none',
              }}
            >
              {isSelected ? (
                <Check className="w-5 h-5 text-white stroke-[3]" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {opt.name}
                </span>
                {opt.id === 'default' && (
                  <span className="text-[9px] font-mono px-1 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Orig.
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
