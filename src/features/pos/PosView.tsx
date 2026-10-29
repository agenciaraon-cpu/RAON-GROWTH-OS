import React, { useState } from 'react';
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, 
  CreditCard, DollarSign, QrCode, CheckCircle2, 
  User, Receipt, ArrowRight, Printer, Sparkles, AlertCircle, X, ShieldCheck
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';
import { Product, SaleItem, PaymentMethod, Sale, AppNavigationRoute } from '../../types';

interface PosViewProps {
  onNavigate?: (route: AppNavigationRoute) => void;
}

export const PosView: React.FC<PosViewProps> = ({ onNavigate }) => {
  const { products, clients, createSale } = useRetailData();
  const { currentTenant, currentUser } = useAuth();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Cart State
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [amountPaid, setAmountPaid] = useState<string>('');

  // UI state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories
  const categories = ['todos', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.currentStock <= 0) {
      alert(`O produto "${product.name}" está sem estoque no momento.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          alert(`Estoque máximo disponível atingido (${product.currentStock} un).`);
          return prev;
        }
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }

      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        size: product.size,
        color: product.color,
        unitPrice: product.salePrice,
        quantity: 1,
        subtotal: product.salePrice,
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (product && newQty > product.currentStock) {
            alert(`Estoque máximo (${product.currentStock} un) atingido.`);
            return item;
          }
          return { ...item, quantity: newQty, subtotal: newQty * item.unitPrice };
        }
        return item;
      }).filter(Boolean) as SaleItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setAmountPaid('');
  };

  // Totals
  const subtotal = cart.reduce((acc, i) => acc + i.subtotal, 0);
  const total = Math.max(0, subtotal - discount);
  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleFinishSale = async () => {
    setErrorMessage(null);
    if (cart.length === 0) {
      setErrorMessage('O carrinho está vazio.');
      return;
    }

    if (paymentMethod === 'crediario' && !selectedClientId) {
      setErrorMessage('Para venda no Crediário / A Prazo, é obrigatório selecionar um cliente cadastrado.');
      return;
    }

    setIsSubmitting(true);
    const paidNum = amountPaid ? parseFloat(amountPaid) : undefined;

    const res = await createSale({
      clientId: selectedClientId || undefined,
      clientName: selectedClient?.name || 'Consumidor Final',
      items: cart,
      discount,
      paymentMethod,
      amountPaid: paidNum,
    });
    setIsSubmitting(false);

    if (res.success && res.sale) {
      setCompletedSale(res.sale);
      setIsCheckoutModalOpen(false);
      clearCart();
    } else {
      setErrorMessage(res.error || 'Erro ao processar venda.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-app-primary/30 shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-app-primary bg-app-light px-2.5 py-0.5 rounded-full border border-app-primary/30">
              FRENTE DE CAIXA • PDV
            </span>
            <span className="text-xs text-slate-300">
              Operador: {currentUser?.fullName || 'Vendedor'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Frente de Caixa / PDV Varejou
          </h1>
          <p className="text-xs text-slate-400">
            Realize vendas rápidas, baixe o estoque automaticamente e emita comprovantes na hora.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Loja Ativa</span>
            <span className="text-xs font-bold text-white">{currentTenant?.name}</span>
          </div>
        </div>
      </div>

      {/* Main PDV Area: Products Grid + Cart Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Search & Grid (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Search bar & Category filters */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nome da roupa/produto, código ou código de barras..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-app-primary outline-hidden"
              />
            </div>

            {/* Category chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-app-primary text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'todos' ? 'Todos os Itens' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map(product => {
              const inCart = cart.find(i => i.productId === product.id);
              const isOutOfStock = product.currentStock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && addToCart(product)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                    isOutOfStock
                      ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                      : 'bg-white dark:bg-[#0E172E] border-slate-200 dark:border-slate-800 hover:border-app-primary hover:shadow-md'
                  }`}
                >
                  {inCart && (
                    <span className="absolute top-2 right-2 bg-app-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {inCart.quantity}x
                    </span>
                  )}

                  <div>
                    {product.imageUrl && (
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {product.size && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Tam: {product.size}
                        </span>
                      )}
                      {product.color && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {product.color}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {product.sku}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Preço</span>
                      <span className="text-sm font-black text-app-primary font-mono">
                        R$ {product.salePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block">Estoque</span>
                      <span className={`text-[11px] font-bold font-mono ${
                        isOutOfStock ? 'text-red-500' : product.currentStock <= product.minStock ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {product.currentStock} un
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-[#0E172E] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <ShoppingCart className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nenhum produto encontrado com os filtros atuais.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Cart Summary & Checkout (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-app-primary" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Carrinho de Venda
              </h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-red-500 hover:underline cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cliente da Venda
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
              >
                <option value="">Consumidor Final (Sem cadastro)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} - Débito: R$ {c.currentDebt.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {cart.map(item => (
              <div
                key={item.productId}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.productName}
                  </h5>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>R$ {item.unitPrice.toFixed(2)} un</span>
                    {item.size && <span>• Tam: {item.size}</span>}
                  </div>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer text-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right shrink-0 min-w-[65px]">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                    R$ {item.subtotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-[10px] text-red-500 hover:underline"
                  >
                    remover
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <ShoppingCart className="w-8 h-8 mx-auto opacity-40 mb-2" />
                <p className="text-xs">Nenhum item adicionado ao carrinho.</p>
                <p className="text-[10px]">Clique nos produtos ao lado para incluir na venda.</p>
              </div>
            )}
          </div>

          {/* Subtotal, Discount & Total */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal dos Itens:</span>
              <span className="font-mono font-bold">R$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Desconto (R$):</span>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="0.00"
                value={discount || ''}
                onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-24 px-2 py-1 text-right rounded-lg bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Total a Pagar:</span>
              <span className="text-xl font-black text-app-primary font-mono">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-app-gradient hover:opacity-95 text-white font-extrabold text-sm transition shadow-lg shadow-app-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Ir para Pagamento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Finalizar Venda no Caixa
                </h3>
                <p className="text-xs text-slate-400">
                  {cart.length} itens • Total: <strong>R$ {total.toFixed(2)}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Selecione a Forma de Pagamento:
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'dinheiro', label: 'Dinheiro', icon: DollarSign },
                  { id: 'pix', label: 'PIX', icon: QrCode },
                  { id: 'cartao_credito', label: 'Cartão de Crédito', icon: CreditCard },
                  { id: 'cartao_debito', label: 'Cartão de Débito', icon: CreditCard },
                  { id: 'crediario', label: 'Crediário / Fiado', icon: Receipt },
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as PaymentMethod)}
                      className={`p-3 rounded-xl border font-bold flex items-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-app-primary text-white border-app-primary shadow-xs'
                          : 'bg-slate-50 dark:bg-[#080B14] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If Dinheiro: calculate change */}
            {paymentMethod === 'dinheiro' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Valor recebido do cliente (R$):
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 100.00"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold"
                />
                {parseFloat(amountPaid) > total && (
                  <div className="text-xs text-emerald-600 font-bold flex items-center justify-between pt-1">
                    <span>Troco a devolver:</span>
                    <span className="text-sm font-mono font-black">
                      R$ {(parseFloat(amountPaid) - total).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* If Crediario */}
            {paymentMethod === 'crediario' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1">
                <p className="font-bold">Venda a Prazo no Crediário da Loja:</p>
                <p>
                  O valor de <strong>R$ {total.toFixed(2)}</strong> será adicionado automaticamente ao saldo devedor do cliente <strong>{selectedClient?.name || 'Selecione o cliente'}</strong>.
                </p>
              </div>
            )}

            {/* Final Action Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Voltar
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinishSale}
                className="px-6 py-3 rounded-2xl bg-app-gradient hover:opacity-95 text-white font-extrabold text-xs transition shadow-lg shadow-app-glow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Gravando Venda...' : 'Confirmar e Finalizar Venda'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Success / Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Venda Concluída com Sucesso!
              </h3>
              <p className="text-xs text-slate-400">
                Código: <strong className="text-slate-700 dark:text-slate-200 font-mono">{completedSale.code}</strong>
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <p className="font-bold text-slate-900 dark:text-white uppercase">{currentTenant?.name}</p>
                <p className="text-[10px] text-slate-400">{new Date(completedSale.createdAt).toLocaleString('pt-BR')}</p>
              </div>

              <div className="space-y-1 py-1">
                {completedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[170px]">{item.quantity}x {item.productName}</span>
                    <span>R$ {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-2 space-y-1">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xs">
                  <span>TOTAL:</span>
                  <span>R$ {completedSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Forma:</span>
                  <span className="uppercase">{completedSale.paymentMethod}</span>
                </div>
                {completedSale.change && completedSale.change > 0 && (
                  <div className="flex justify-between text-[10px] text-emerald-500 font-bold">
                    <span>Troco:</span>
                    <span>R$ {completedSale.change.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Cliente:</span>
                  <span>{completedSale.clientName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Recibo</span>
              </button>

              <button
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-hover text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-app-glow"
              >
                <span>Nova Venda</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
