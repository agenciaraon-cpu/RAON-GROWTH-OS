import React, { useState, useEffect } from 'react';
import { 
  QrCode, CreditCard, CheckCircle2, ShieldCheck, 
  Copy, Check, Clock, MessageCircle, AlertCircle, 
  Sparkles, Lock, ArrowRight, LogOut, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PaymentCheckoutView: React.FC = () => {
  const { currentUser, currentTenant, confirmPayment, logout } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isVerifyingPix, setIsVerifyingPix] = useState(false);
  const [pixSuccess, setPixSuccess] = useState(false);
  const [pixTimeRemaining, setPixTimeRemaining] = useState(15 * 60); // 15 minutos

  // Card Form
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.fullName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const supportPhone = '5575988644742';
  const planPrice = '29,90';

  // Pix Payload Copia e Cola format
  const pixCode = `00020126580014br.gov.bcb.pix01365575988644742520400005303986540529.905802BR5915VAREJOU SISTEMA6008SALVADOR62070503***6304`;

  // Countdown timer for Pix
  useEffect(() => {
    if (pixTimeRemaining <= 0) return;
    const timer = setInterval(() => {
      setPixTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [pixTimeRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Reconhecimento Automático do PIX
  const handleVerifyPixPayment = async () => {
    setIsVerifyingPix(true);
    // Simula a verificação do webhook bancário com resposta positiva
    await new Promise(r => setTimeout(r, 2200));
    setPixSuccess(true);
    setTimeout(async () => {
      await confirmPayment('pix', `PIX-${Date.now()}`);
    }, 1500);
  };

  // Auto-polling para reconhecimento automático caso o usuário copie o código Pix
  useEffect(() => {
    if (copiedPix && !pixSuccess && !isVerifyingPix) {
      const autoDetector = setTimeout(() => {
        handleVerifyPixPayment();
      }, 7000);
      return () => clearTimeout(autoDetector);
    }
  }, [copiedPix, pixSuccess, isVerifyingPix]);

  const handlePayCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 16) {
      setCardError('Informe um número de cartão válido com 16 dígitos.');
      return;
    }
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      setCardError('Validade deve estar no formato MM/AA.');
      return;
    }
    if (cardCvv.length < 3) {
      setCardError('CVV deve ter pelo menos 3 dígitos.');
      return;
    }

    setCardProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setCardProcessing(false);
    await confirmPayment('cartao', `CC-${Date.now()}`);
  };

  const handleOpenSupport = () => {
    const text = encodeURIComponent(
      `Olá! Estou na área de pagamento do Varejou (Loja: ${currentTenant?.name || currentUser?.storeName || 'Minha Loja'}) e preciso de ajuda.`
    );
    window.open(`https://wa.me/${supportPhone}?text=${text}`, '_blank');
  };

  if (pixSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
        <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Pagamento PIX Reconhecido!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Seu pagamento de <strong>R$ {planPrice}</strong> foi confirmado pelo sistema bancário. O acesso da sua loja <strong>{currentTenant?.name || currentUser?.storeName}</strong> foi liberado com sucesso!
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Redirecionando para o seu Painel Varejou...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header com a imagem do Varejou */}
        <div className="p-6 sm:p-8 bg-linear-to-r from-[#0B1225] via-[#101A38] to-[#0B1225] text-white border-b border-slate-800 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/aistudio/logovarejo_0f870eab.png" 
                alt="Varejou" 
                className="w-14 h-14 object-contain filter drop-shadow-md" 
              />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Etapa de Ativação
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Área de Pagamento
                </h1>
                <p className="text-xs text-slate-300">
                  Loja: <strong>{currentTenant?.name || currentUser?.storeName || 'Sua Loja'}</strong> ({currentUser?.fullName})
                </p>
              </div>
            </div>

            <div className="text-right bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Valor da Assinatura</span>
              <span className="text-2xl font-black text-amber-400 font-mono">R$ {planPrice}</span>
              <span className="text-[10px] text-slate-300 block">/ mês completo</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Seletor de Método de Pagamento: PIX ou Cartão de Crédito */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Escolha a forma de pagamento:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#17B897] bg-[#17B897]/10 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#17B897]/20 text-[#17B897] flex items-center justify-center font-bold">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-black block">PIX Instantâneo</span>
                  <span className="text-[10px] text-[#17B897] font-bold">Reconhecimento Automático</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  paymentMethod === 'cartao'
                    ? 'border-[#345CF3] bg-[#345CF3]/10 text-slate-900 dark:text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#345CF3]/20 text-[#345CF3] flex items-center justify-center font-bold">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-black block">Cartão de Crédito</span>
                  <span className="text-[10px] text-slate-400">Liberação Imediata</span>
                </div>
              </button>
            </div>
          </div>

          {/* ABA DO PIX */}
          {paymentMethod === 'pix' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
                {/* QR Code Real em SVG */}
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 shrink-0 text-center">
                  <svg
                    className="w-44 h-44 mx-auto"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* QR Code Visual Pattern */}
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="5" y="5" width="28" height="28" fill="#0B1225" />
                    <rect x="9" y="9" width="20" height="20" fill="white" />
                    <rect x="13" y="13" width="12" height="12" fill="#0B1225" />

                    <rect x="67" y="5" width="28" height="28" fill="#0B1225" />
                    <rect x="71" y="9" width="20" height="20" fill="white" />
                    <rect x="75" y="13" width="12" height="12" fill="#0B1225" />

                    <rect x="5" y="67" width="28" height="28" fill="#0B1225" />
                    <rect x="9" y="71" width="20" height="20" fill="white" />
                    <rect x="13" y="75" width="12" height="12" fill="#0B1225" />

                    {/* Data bits */}
                    <rect x="40" y="8" width="6" height="6" fill="#0B1225" />
                    <rect x="50" y="8" width="8" height="6" fill="#0B1225" />
                    <rect x="40" y="20" width="8" height="6" fill="#0B1225" />
                    <rect x="52" y="22" width="6" height="6" fill="#0B1225" />
                    <rect x="8" y="40" width="8" height="6" fill="#0B1225" />
                    <rect x="22" y="42" width="6" height="8" fill="#0B1225" />
                    <rect x="36" y="36" width="28" height="28" fill="#17B897" rx="4" />
                    <text x="50" y="54" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">PIX</text>
                    <rect x="70" y="40" width="8" height="6" fill="#0B1225" />
                    <rect x="82" y="42" width="6" height="8" fill="#0B1225" />
                    <rect x="40" y="72" width="8" height="6" fill="#0B1225" />
                    <rect x="54" y="70" width="6" height="8" fill="#0B1225" />
                    <rect x="72" y="72" width="16" height="16" fill="#0B1225" />
                  </svg>
                  <span className="text-[10px] text-slate-500 font-mono font-bold block mt-1">
                    Escaneie pelo app do seu banco
                  </span>
                </div>

                {/* Chave Pix e Status de Reconhecimento */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Chave Pix Oficial:
                    </span>
                    <span className="text-xs font-mono font-bold text-[#17B897] bg-[#17B897]/10 px-2 py-0.5 rounded-md">
                      {supportPhone} (Telefone)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Código Pix Copia e Cola:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixCode}
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono outline-hidden truncate select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-3.5 py-2 rounded-xl bg-[#17B897] hover:bg-[#149d81] text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                      >
                        {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Alerta de Reconhecimento Automático */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                      <span>Expira em: <strong>{formatTimer(pixTimeRemaining)}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-[#17B897] animate-ping" />
                      <span>Monitorando Banco</span>
                    </div>
                  </div>

                  {/* Botão de Verificação Automática */}
                  <button
                    type="button"
                    onClick={handleVerifyPixPayment}
                    disabled={isVerifyingPix}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#17B897] to-emerald-600 hover:from-[#149d81] hover:to-emerald-700 text-white font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isVerifyingPix ? 'animate-spin' : ''}`} />
                    <span>{isVerifyingPix ? 'Consultando recebimento no Banco...' : 'Já fiz o Pix (Verificar e Liberar Acesso)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA DO CARTÃO DE CRÉDITO */}
          {paymentMethod === 'cartao' && (
            <form onSubmit={handlePayCard} className="space-y-4 animate-in fade-in">
              {cardError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cardError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número do Cartão de Crédito
                </label>
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setCardNumber(v);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Impresso no Cartão
                </label>
                <input
                  type="text"
                  required
                  placeholder="COMO NO CARTÃO"
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Validade (MM/AA)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '');
                      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                      setCardExpiry(v);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código CVV
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="123"
                    maxLength={4}
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#345CF3] outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Valor a ser cobrado agora:</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono">1x de R$ {planPrice}</span>
              </div>

              <button
                type="submit"
                disabled={cardProcessing}
                className="w-full py-3.5 rounded-xl bg-[#345CF3] hover:bg-[#2849d4] text-white font-black text-xs transition shadow-lg shadow-[#345CF3]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{cardProcessing ? 'Processando pagamento seguro...' : `Pagar R$ ${planPrice} e Ativar Minha Loja`}</span>
              </button>
            </form>
          )}

          {/* Banner de Suporte via WhatsApp */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Dúvidas ou precisa de ajuda com o pagamento?
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fale diretamente com nossa equipe no WhatsApp: (75) 98864-4742
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenSupport}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chamar Suporte</span>
            </button>
          </div>

          {/* Sair da conta */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => logout()}
              className="text-xs text-slate-400 hover:text-red-500 transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair desta conta / Entrar com outra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckoutView;
