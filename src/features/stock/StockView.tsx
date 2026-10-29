import React, { useState } from 'react';
import { 
  Boxes, Search, AlertTriangle, ArrowUpRight, 
  ArrowDownRight, Plus, Minus, Package, CheckCircle2, 
  DollarSign, TrendingUp, Filter, Shirt
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';

export const StockView: React.FC = () => {
  const { products, adjustStock, metrics } = useRetailData();
  const { currentTenant } = useAuth();

  const [search, setSearch] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [quickAdjustModalProduct, setQuickAdjustModalProduct] = useState<{ id: string; name: string; current: number } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('5');

  const filtered = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLow = filterLowStockOnly ? p.currentStock <= p.minStock : true;
    return matchesSearch && matchesLow;
  });

  const handleApplyAdjustment = async (isAddition: boolean) => {
    if (!quickAdjustModalProduct) return;
    const qty = parseInt(adjustAmount) || 0;
    if (qty <= 0) return;

    await adjustStock(quickAdjustModalProduct.id, isAddition ? qty : -qty);
    setQuickAdjustModalProduct(null);
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
            Gestão de Estoque & Reposição
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Acompanhe o saldo físico de mercadorias, valor investido a preço de custo e reposição de itens em alerta.
          </p>
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
            {products.length} produtos cadastrados
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

      {/* Filter and Table */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU da roupa/produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
          />
        </div>

        <button
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            filterLowStockOnly
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{filterLowStockOnly ? 'Exibindo Apenas Estoque Baixo' : 'Filtrar Estoque Crítico'}</span>
        </button>
      </div>

      {/* Stock Table */}
      <div className="bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Grade / Cor</th>
                <th className="py-3 px-4">Custo Unit.</th>
                <th className="py-3 px-4">Total Investido</th>
                <th className="py-3 px-4">Estoque Atual</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Movimentar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map(p => {
                const isOutOfStock = p.currentStock === 0;
                const isLow = p.currentStock <= p.minStock && !isOutOfStock;
                const totalInvested = p.costPrice * p.currentStock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {p.sku}
                    </td>

                    <td className="py-3 px-4">
                      {p.size && <span className="mr-1.5 font-bold">Tam: {p.size}</span>}
                      {p.color && <span className="text-slate-400">({p.color})</span>}
                    </td>

                    <td className="py-3 px-4 font-mono">
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
                      <button
                        onClick={() => setQuickAdjustModalProduct({ id: p.id, name: p.name, current: p.currentStock })}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        Ajustar Estoque
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Quick Stock Adjustment */}
      {quickAdjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ajustar Estoque de Mercadoria
            </h3>
            <p className="text-xs text-slate-400">
              {quickAdjustModalProduct.name} • Saldo atual: <strong>{quickAdjustModalProduct.current} un</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantidade a movimentar:
              </label>
              <input
                type="number"
                min="1"
                value={adjustAmount}
                onChange={e => setAdjustAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleApplyAdjustment(true)}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Dar Entrada (+)</span>
              </button>

              <button
                onClick={() => handleApplyAdjustment(false)}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
                <span>Dar Baixa (-)</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setQuickAdjustModalProduct(null)}
                className="text-xs text-slate-400 hover:underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
