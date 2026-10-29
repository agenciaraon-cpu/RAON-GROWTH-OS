import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsAppSupport: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const supportPhone = '5575988644742';

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('Olá! Gostaria de falar com o suporte oficial do Varejou.');
    window.open(`https://wa.me/${supportPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group">
      {/* Tooltip / Badge */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white dark:bg-[#0E172E] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xl text-xs font-bold animate-in fade-in slide-in-from-right-3">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span>Suporte Online: (75) 98864-4742</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleOpenWhatsApp}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer relative"
        title="Falar com o suporte no WhatsApp (55 75 98864-4742)"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black flex items-center justify-center text-white border-2 border-white dark:border-[#0B1225]">
          1
        </span>
      </button>
    </div>
  );
};

export default FloatingWhatsAppSupport;
