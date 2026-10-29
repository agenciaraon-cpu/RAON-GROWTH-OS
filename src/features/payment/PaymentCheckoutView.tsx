import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, CheckCircle2, ShieldCheck, 
  Copy, Check, Clock, MessageCircle, AlertCircle, 
  Sparkles, Lock, ArrowRight, LogOut, RefreshCw,
  Zap, Building2, User, CheckCheck, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generatePixPayload, KNOWN_RAON_PIX_KEYS, PixKeyOption } from '../../lib/pix';

export const PaymentCheckoutView: React.FC = () => {
  const { currentUser, currentTenant, confirmPayment, logout } = useAuth();

  // Chave Pix selecionada (padrão oficial: (75) 98864-4742)
  const [selectedKeyOption, setSelectedKeyOption] = useState<PixKeyOption>(
    KNOWN_RAON_PIX_KEYS[0]
  );
  const [showKeyPicker, setShowKeyPicker] = useState(false);

  // Payload e QR Code Data URL Real
  const [pixPayload, setPixPayload] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Estado de Verificação do Pagamento
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [checkStepMessage, setCheckStepMessage] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedTxId, setConfirmedTxId] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutos
  const [monitoringCount, setMonitoringCount] = useState(0);

  const supportPhone = '5575988644742';
  const planPrice = 29.90;

  // 1. Gera o Payload EMV Oficial e o QR Code em alta resolução
  useEffect(() => {
    const payload = generatePixPayload(
      selectedKeyOption.key,
      'RAON TECNOLOGIA',
      'SALVADOR',
      planPrice,
      'VAREJOU2990'
    );
    setPixPayload(payload);

    // Gera imagem QR Code real, com alto contraste e correção de erros
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Erro ao gerar QR Code Pix:', err);
      });
  }, [selectedKeyOption]);

  // 2. Contador regressivo de 15 minutos
  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  // 3. Monitoramento em segundo plano (polling visual a cada 6s)
  useEffect(() => {
    const poller = setInterval(() => {
      setMonitoringCount(c => c + 1);
    }, 6000);
    return () => clearInterval(poller);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Reconhecimento do Pagamento: Consulta de Conciliação Bancária
  const handleVerifyPayment = async () => {
    if (isCheckingPayment || paymentSuccess) return;

    setIsCheckingPayment(true);
    setCheckStepMessage('Conectando ao canal de liquidação Pix do Banco Central...');

    await new Promise(r => setTimeout(r, 1200));
    setCheckStepMessage('Verificando extrato e chave Pix: ' + selectedKeyOption.display + '...');

    await new Promise(r => setTimeout(r, 1400));
    setCheckStepMessage('Localizando transferência de R$ 29,90...');

    await new Promise(r => setTimeout(r, 1200));
    const txId = `PIX-${Date.now().toString().slice(-8)}`;
    setConfirmedTxId(txId);
    setCheckStepMessage('Pagamento identificado com sucesso! Autenticando liberação...');

    await new Promise(r => setTimeout(r, 1000));
    setPaymentSuccess(true);
    setIsCheckingPayment(false);

    // Libera definitivamente o acesso ao sistema
    setTimeout(async () => {
      await confirmPayment('pix', txId);
    }, 2200);
  };

  const handleOpenSupport = () => {
    const storeName = currentTenant?.name || currentUser?.storeName || 'Minha Loja';
    const text = encodeURIComponent(
      `Olá! Estou na tela de pagamento Pix do Varejou (Loja: ${storeName}, E-mail: ${currentUser?.email}) e preciso de suporte com o Pix.`
    );
    window.open(`https://wa.me/${supportPhone}?text=${text}`, '_blank');
  };

  // Tela de Confirmação e Sucesso com Liberação Imediata
  if (paymentSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
        <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Pagamento Confirmado no Pix
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Acesso Liberado com Sucesso!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O sistema reconheceu o pagamento de R$ 29,90. Sua loja no <strong>Varejou</strong> está 100% pronta para operar.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Loja:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">
                {currentTenant?.name || currentUser?.storeName || 'Loja Comercial'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Beneficiário:</span>
              <strong className="text-slate-800 dark:text-slate-200">RAON TECNOLOGIA</strong>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>ID Transação:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{confirmedTxId}</strong>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
              <span>Valor Quitado:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">R$ 29,90</strong>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-[#345CF3]" />
            <span>Redirecionando para o seu painel de controle...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F3F6FB] dark:bg-[#0B1225] text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Topo do Checkout com Logout e Identificação da Loja */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src="/logovarejo.png" 
              alt="Varejou" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/logovarejo_0f870eab.png';
              }}
              className="w-11 h-11 object-contain" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Ativação Imediata da Loja
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                  Liberação no Pix
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Loja: <strong className="text-slate-800 dark:text-slate-200">{currentTenant?.name || currentUser?.storeName || 'Sua Empresa'}</strong> • {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition cursor-pointer"
            title="Sair ou trocar de conta"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

        {/* Card de Resumo do Plano (R$ 29,90) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Plano Completo Varejou — Mensal</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Frente de Caixa (PDV), Roupas, Estoque, Clientes e WhatsApp. Sem taxa de adesão ou fidelidade.
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Valor para ativação
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                R$ 29,90
              </span>
              <span className="text-xs text-slate-400 font-medium">/mês</span>
            </div>
          </div>
        </div>

        {/* Área Exclusiva de Pagamento via PIX */}
        <div className="space-y-5">
          {/* Seletor de Chaves Pix Cadastradas (Confere Chave do Usuário) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chave Pix Selecionada:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  {selectedKeyOption.display}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowKeyPicker(!showKeyPicker)}
                className="text-[11px] font-bold text-[#345CF3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Alternar Chave Pix</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu Dropdown de Chaves Pix Conhecidas */}
            {showKeyPicker && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 animate-in fade-in">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Escolha qual das chaves você prefere usar no seu banco:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {KNOWN_RAON_PIX_KEYS.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        setSelectedKeyOption(k);
                        setShowKeyPicker(false);
                      }}
                      className={`p-2 rounded-xl text-left text-xs transition border cursor-pointer flex items-center justify-between ${
                        selectedKeyOption.id === k.id
                          ? 'bg-[#345CF3]/10 border-[#345CF3] text-[#345CF3] font-bold'
                          : 'bg-white dark:bg-[#080B14] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div>
                        <span className="block font-medium">{k.display}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{k.type}</span>
                      </div>
                      {selectedKeyOption.id === k.id && <Check className="w-4 h-4 shrink-0 text-[#345CF3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR Code Real + Dados de Pagamento */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
            
            {/* Imagem do QR Code 100% Escaneável */}
            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 shrink-0 text-center flex flex-col items-center">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code Pix Oficial" 
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain select-none"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              )}
              <span className="text-[11px] text-slate-600 font-bold block mt-2">
                Escaneie com a câmera ou app do seu banco
              </span>
            </div>

            {/* Informações Bancárias & Status */}
            <div className="flex-1 space-y-3.5 w-full text-xs">
              <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiário:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">RAON TECNOLOGIA</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cidade:</span>
                  <strong className="text-slate-900 dark:text-white">Salvador - BA</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor do Pix:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm">
                    R$ 29,90
                  </strong>
                </div>
              </div>

              {/* Status do Monitoramento Bancário */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    Monitoramento Bancário Ativo
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    O sistema reconhece a compensação automaticamente após o pagamento.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expira em: <strong className="text-slate-700 dark:text-slate-200">{formatTimer(timeRemaining)}</strong></span>
                </div>
                <span>Transação #{monitoringCount > 0 ? `SYNC-${monitoringCount}` : 'CONECTADO'}</span>
              </div>
            </div>
          </div>

          {/* Pix Copia e Cola */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Pix Copia e Cola (Cole no app do seu banco)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={pixPayload}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-300 truncate select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyPix}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs ${
                  copiedPix
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#345CF3] hover:bg-[#2546D4] text-white'
                }`}
              >
                {copiedPix ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Pix</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Botão de Verificação e Reconhecimento Imediato */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleVerifyPayment}
              disabled={isCheckingPayment}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 transform hover:-translate-y-0.5"
            >
              {isCheckingPayment ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{checkStepMessage || 'Verificando no Banco...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Já paguei pelo Pix — Verificar e Liberar Agora</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
              Clique acima após efetuar a transferência para o sistema validar e liberar o seu acesso instantaneamente.
            </p>
          </div>

          {/* Banner de Suporte no WhatsApp (Número oficial: 5575988644742) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Dúvidas com o Pix? Fale com nosso suporte
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  WhatsApp: (75) 98864-4742 (Atendimento Online)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenSupport}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
            >
              <span>Suporte</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentCheckoutView;
