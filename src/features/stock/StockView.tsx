import React, { useState, useEffect } from 'react';
import { 
  Boxes, Search, AlertTriangle, Plus, Minus, 
  Filter, Shirt, Layers, List, ArrowDownCircle, ArrowUpCircle,
  CheckCircle2, Clock, Tag, X
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

interface StockMovementLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'baixa' | 'entrada';
  quantity: number;
  reason: string;
  previousStock: number;
  newStock: number;
  actorName: string;
  createdAt: string;
}

const WRITE_OFF_REASONS = [
  'Venda externa / WhatsApp',
  'Avaria ou defeito na peça',
  'Troca / Devolução de cliente',
  'Uso interno / Brinde / Marketing',
  'Ajuste de inventário físico',
];

const ENTRY_REASONS = [
  'Reposição de fornecedor / Compra',
  'Devolução de cliente para estoque',
  'Ajuste de inventário físico',
  'Transferência entre lojas',
];

export const StockView: React.FC = () => {
  const { products, adjustStock, metrics } = useRetailData();
  const { currentTenant, currentUser } = useAuth();

  // Busca & Filtros completos
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [sizeFilter, setSizeFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'baixo' | 'esgotado' | 'normal'>('todos');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  // Modal de Movimentação (Dar Baixa / Dar Entrada)
  const [adjustModal, setAdjustModal] = useState<{
    product: Product;
    mode: 'baixa' | 'entrada';
  } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('1');
  const [adjustReason, setAdjustReason] = useState(WRITE_OFF_REASONS[0]);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  // Histórico recente de baixas/entradas por loja
  const [movementLogs, setMovementLogs] = useState<StockMovementLog[]>([]);

  useEffect(() => {
    if (!currentTenant) return;
    try {
      const raw = localStorage.getItem(`varejou_stock_logs_${currentTenant.id}`);
      setMovementLogs(raw ? JSON.parse(raw) : []);
    } catch {
      setMovementLogs([]);
    }
  }, [currentTenant?.id]);

  const saveMovementLog = (log: StockMovementLog) => {
    const next = [log, ...movementLogs].slice(0, 30);
    setMovementLogs(next);
    if (currentTenant) {
      localStorage.setItem(`varejou_stock_logs_${currentTenant.id}`, JSON.stringify(next));
    }
  };

  // Opções dinâmicas de Categoria e Grade baseadas nos produtos
  const uniqueCategories = Array.from(new Set(products.map(p => p.category || 'Outros'))).sort();
  const uniqueSizes = Array.from(new Set(products.map(p => p.size).filter(Boolean) as string[]));

  // Filtragem combinada
  const filtered = products.filter(p => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.toLowerCase().includes(q)) ||
      (p.color && p.color.toLowerCase().includes(q)) ||
      (p.size && p.size.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );

    const matchesCategory = categoryFilter === 'todas' || (p.category || 'Outros') === categoryFilter;
    const matchesSize = sizeFilter === 'todas' || p.size === sizeFilter;

    const isOutOfStock = p.currentStock === 0;
    const isLow = p.currentStock <= p.minStock && !isOutOfStock;
    const matchesStatus =
      statusFilter === 'todos' ? true :
      statusFilter === 'esgotado' ? isOutOfStock :
      statusFilter === 'baixo' ? (isLow || isOutOfStock) :
      (!isOutOfStock && !isLow);

    return matchesSearch && matchesCategory && matchesSize && matchesStatus;
  });

  // Agrupamento organizado por categoria
  const groupedByCategory = filtered.reduce<Record<string, Product[]>>((acc, prod) => {
    const cat = prod.category || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {});

  const openMovementModal = (product: Product, mode: 'baixa' | 'entrada') => {
    setAdjustModal({ product, mode });
    setAdjustAmount('1');
    setAdjustReason(mode === 'baixa' ? WRITE_OFF_REASONS[0] : ENTRY_REASONS[0]);
    setAdjustError(null);
  };

  const handleConfirmMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModal) return;

    const qty = parseInt(adjustAmount, 10) || 0;
    if (qty <= 0) {
      setAdjustError('Informe uma quantidade válida maior que zero.');
      return;
    }

    const { product, mode } = adjustModal;
    if (mode === 'baixa' && qty > product.currentStock) {
      setAdjustError(`Não é possível dar baixa em ${qty} un. O saldo atual é de ${product.currentStock} un.`);
      return;
    }

    const delta = mode === 'entrada' ? qty : -qty;
    const newStock = Math.max(0, product.currentStock + delta);

    await adjustStock(product.id, delta);

    saveMovementLog({
      id: `mov-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: mode,
      quantity: qty,
      reason: adjustReason,
      previousStock: product.currentStock,
      newStock,
      actorName: currentUser?.fullName || 'Operador',
      createdAt: new Date().toISOString(),
    });

    setAdjustModal(null);
  };

  const renderProductRow = (p: Product) => {
    const isOutOfStock = p.currentStock === 0;
    const isLow = p.currentStock <= p.minStock && !isOutOfStock;
    const totalInvested = p.costPrice * p.currentStock;
    const thumb = (p.images && p.images[0]) || p.imageUrl;

    return (
      <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              {thumb ? (
                <img src={thumb} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <Shirt className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">{p.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{p.sku}</span>
            </div>
          </div>
        </td>

        <td className="py-3 px-4">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {p.category}
          </span>
        </td>

        <td className="py-3 px-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {p.size && (
              <span className="px-2 py-0.5 rounded-md bg-app-light text-app-primary font-bold text-[10px]">
                Tam: {p.size}
              </span>
            )}
            {p.color && <span className="text-slate-500 dark:text-slate-400 text-[11px]">{p.color}</span>}
          </div>
        </td>

        <td className="py-3 px-4 font-mono text-slate-500">
          R$ {p.costPrice.toFixed(2)}
        </td>

        <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
          R$ {totalInvested.toFixed(2)}
        </td>

        <td className="py-3 px-4 font-mono font-extrabold text-sm">
          {p.currentStock} un
        </td>

        <td className="py-3 px-4">
          {isOutOfStock ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 border border-red-500/30">
              Esgotado
            </span>
          ) : isLow ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Repor (Mín: {p.minStock})
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              Normal
            </span>
          )}
        </td>

        <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => openMovementModal(p, 'baixa')}
              disabled={p.currentStock === 0}
              className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Dar baixa neste produto"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Dar Baixa</span>
            </button>

            <button
              onClick={() => openMovementModal(p, 'entrada')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Adicionar entrada de estoque"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Entrada</span>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-app-primary/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-app-primary bg-app-light px-2.5 py-0.5 rounded-full border border-app-primary/30">
              CONTROLE DE ESTOQUE & INVENTÁRIO
            </span>
            <span className="text-xs text-slate-400">
              Loja: {currentTenant?.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Gestão de Estoque por Categorias & Baixas
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Busque por produto ou grade, organize o estoque separado por categorias e registre entradas ou baixas com motivo detalhado.
          </p>
        </div>

        {/* Toggle Visualização Organizada por Categorias */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grouped')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'grouped'
                ? 'bg-app-primary text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Por Categorias</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-app-primary text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Lista Geral</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Itens Totais em Estoque</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {products.reduce((acc, p) => acc + p.currentStock, 0)} <span className="text-xs text-slate-400 font-sans">unidades</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {products.length} produtos em {uniqueCategories.length} categorias
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valor Investido (Custo)</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            R$ {metrics.totalStockCost.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Patrimônio em mercadorias
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Potencial de Venda</span>
          <div className="text-2xl font-extrabold text-app-primary mt-1 font-mono">
            R$ {metrics.totalStockRetail.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-500 mt-1 block font-medium">
            Lucro potencial: R$ {(metrics.totalStockRetail - metrics.totalStockCost).toFixed(2)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerta de Estoque Baixo</span>
          <div className={`text-2xl font-extrabold mt-1 font-mono ${metrics.lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {metrics.lowStockCount} <span className="text-xs font-sans text-slate-400">itens</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Abaixo do estoque mínimo
          </span>
        </div>
      </div>

      {/* Painel de Busca + Filtro por Categoria + Filtro por Grade + Status */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Busca por nome, SKU, código de barras ou cor */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome do produto, SKU, código de barras, cor ou tamanho..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
            />
          </div>

          {/* Filtro por Grade / Tamanho */}
          <div className="md:col-span-3">
            <select
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-hidden focus:border-app-primary"
            >
              <option value="todas">Grade / Tamanho: Todos</option>
              {uniqueSizes.map(sz => (
                <option key={sz} value={sz}>Grade / Tam: {sz}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-hidden focus:border-app-primary"
            >
              <option value="todos">Status: Todos ({products.length})</option>
              <option value="baixo">Estoque Baixo / Crítico ({metrics.lowStockCount})</option>
              <option value="esgotado">Esgotados ({products.filter(p => p.currentStock === 0).length})</option>
              <option value="normal">Estoque Normal</option>
            </select>
          </div>
        </div>

        {/* Abas organizadas de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Categorias:
          </span>
          <button
            onClick={() => setCategoryFilter('todas')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
              categoryFilter === 'todas'
                ? 'bg-app-primary text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Todas ({products.length})
          </button>
          {uniqueCategories.map(cat => {
            const count = products.filter(p => (p.category || 'Outros') === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-app-primary text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Exibição Organizada por Categorias ou Lista Geral */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 space-y-2">
          <Boxes className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Nenhum item encontrado no estoque com os filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('todas');
              setSizeFilter('todas');
              setStatusFilter('todos');
            }}
            className="text-xs font-bold text-app-primary hover:underline cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        <div className="space-y-5">
          {Object.entries(groupedByCategory).map(([catName, items]) => {
            const catUnits = items.reduce((sum, i) => sum + i.currentStock, 0);
            const catCost = items.reduce((sum, i) => sum + (i.costPrice * i.currentStock), 0);

            return (
              <div key={catName} className="bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                {/* Cabeçalho da Categoria */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-app-light text-app-primary flex items-center justify-center">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {catName}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {items.length} {items.length === 1 ? 'produto' : 'produtos'} nesta categoria
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Peças: <strong className="text-slate-900 dark:text-white font-mono">{catUnits} un</strong>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Investido: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">R$ {catCost.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Produto / SKU</th>
                        <th className="py-2.5 px-4">Categoria</th>
                        <th className="py-2.5 px-4">Grade / Cor</th>
                        <th className="py-2.5 px-4">Custo Unit.</th>
                        <th className="py-2.5 px-4">Total Investido</th>
                        <th className="py-2.5 px-4">Estoque</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Dar Baixa / Entrada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {items.map(renderProductRow)}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Produto / SKU</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Grade / Cor</th>
                  <th className="py-3 px-4">Custo Unit.</th>
                  <th className="py-3 px-4">Total Investido</th>
                  <th className="py-3 px-4">Estoque</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Dar Baixa / Entrada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map(renderProductRow)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Histórico Recente de Baixas e Entradas */}
      {movementLogs.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-app-primary" />
              <span>Últimas Movimentações e Baixas de Estoque</span>
            </h3>
            <span className="text-[10px] text-slate-400">{movementLogs.length} registros recentes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {movementLogs.slice(0, 6).map(log => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    log.type === 'baixa'
                      ? 'bg-red-500/15 text-red-500'
                      : 'bg-emerald-500/15 text-emerald-500'
                  }`}>
                    {log.type === 'baixa' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block truncate">
                      {log.productName}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {log.reason} • {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className={`font-black block ${log.type === 'baixa' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {log.type === 'baixa' ? `-${log.quantity}` : `+${log.quantity}`} un
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {log.previousStock} → {log.newStock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Organizado de Baixa / Entrada no Estoque */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleConfirmMovement}
            className="w-full max-w-md bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {adjustModal.mode === 'baixa' ? 'Dar Baixa no Estoque' : 'Dar Entrada no Estoque'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {adjustModal.product.name} ({adjustModal.product.sku})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alternar Modo Baixa / Entrada */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setAdjustModal({ ...adjustModal, mode: 'baixa' });
                  setAdjustReason(WRITE_OFF_REASONS[0]);
                  setAdjustError(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  adjustModal.mode === 'baixa'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                <span>Dar Baixa (-)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustModal({ ...adjustModal, mode: 'entrada' });
                  setAdjustReason(ENTRY_REASONS[0]);
                  setAdjustError(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  adjustModal.mode === 'entrada'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>Dar Entrada (+)</span>
              </button>
            </div>

            {adjustError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{adjustError}</span>
              </div>
            )}

            {/* Quantidade + atalhos rápidos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Quantidade ({adjustModal.mode === 'baixa' ? 'retirar' : 'adicionar'}):
                </label>
                <span className="text-[11px] text-slate-400">
                  Saldo atual: <strong className="text-slate-800 dark:text-white font-mono">{adjustModal.product.currentStock} un</strong>
                </span>
              </div>
              <input
                type="number"
                min="1"
                value={adjustAmount}
                onChange={e => setAdjustAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold outline-hidden focus:border-app-primary"
              />
              <div className="flex items-center gap-2">
                {[1, 2, 5, 10].map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAdjustAmount(String(q))}
                    className="flex-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {q} un
                  </button>
                ))}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Motivo da movimentação:
              </label>
              <select
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
              >
                {(adjustModal.mode === 'baixa' ? WRITE_OFF_REASONS : ENTRY_REASONS).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Prévia do saldo final */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Saldo após movimentação:</span>
              <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                {adjustModal.product.currentStock} un →{' '}
                <span className={adjustModal.mode === 'baixa' ? 'text-red-500' : 'text-emerald-500'}>
                  {Math.max(
                    0,
                    adjustModal.product.currentStock +
                      (adjustModal.mode === 'entrada' ? (parseInt(adjustAmount, 10) || 0) : -(parseInt(adjustAmount, 10) || 0))
                  )}{' '}
                  un
                </span>
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                  adjustModal.mode === 'baixa'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{adjustModal.mode === 'baixa' ? 'Confirmar Baixa' : 'Confirmar Entrada'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
