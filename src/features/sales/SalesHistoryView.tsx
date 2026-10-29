import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Receipt, Printer, 
  CheckCircle2, DollarSign, Calendar, Eye, X
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';
import { Sale, AppNavigationRoute } from '../../types';

interface SalesHistoryViewProps {
  onNavigate?: (route: AppNavigationRoute) => void;
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({ onNavigate }) => {
  const { sales } = useRetailData();
  const { currentTenant } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(s => 
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.clientName.toLowerCase().includes(search.toLowerCase()) ||
    s.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-app-primary/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-app-primary bg-app-light px-2.5 py-0.5 rounded-full border border-app-primary/30">
              HISTÓRICO DE VENDAS
            </span>
            <span className="text-xs text-slate-400">
              Loja: {currentTenant?.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Relatório de Vendas Realizadas
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Consulte todas as operações de frente de caixa, formas de pagamento recebidas e segunda via de recibos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Faturamento Total</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              R$ {totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por código (VEN-...), nome do cliente ou vendedor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filteredSales.length} vendas registradas
        </span>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Data & Hora</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Forma de Pagto</th>
                <th className="py-3 px-4">Total da Venda</th>
                <th className="py-3 px-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredSales.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {s.code}
                  </td>

                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {new Date(s.createdAt).toLocaleString('pt-BR')}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {s.clientName}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {s.items.reduce((acc, i) => acc + i.quantity, 0)} itens ({s.items.length} produtos)
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 uppercase text-slate-700 dark:text-slate-300">
                      {s.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-black text-sm text-app-primary">
                    R$ {s.total.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedSale(s)}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Ver Recibo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs">Nenhuma venda realizada nesta loja ainda.</p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400">Comprovante de Venda</span>
              <button onClick={() => setSelectedSale(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <p className="font-bold text-slate-900 dark:text-white uppercase">{currentTenant?.name}</p>
                <p className="text-[10px] text-slate-400">{new Date(selectedSale.createdAt).toLocaleString('pt-BR')}</p>
                <p className="text-[10px] font-bold text-app-primary mt-1">{selectedSale.code}</p>
              </div>

              <div className="space-y-1.5 py-2">
                {selectedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[170px]">{item.quantity}x {item.productName}</span>
                    <span>R$ {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-2 space-y-1">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Subtotal:</span>
                  <span>R$ {selectedSale.subtotal.toFixed(2)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-emerald-500 text-[11px]">
                    <span>Desconto:</span>
                    <span>- R$ {selectedSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL PAGO:</span>
                  <span className="text-app-primary">R$ {selectedSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Pagamento:</span>
                  <span className="uppercase">{selectedSale.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Cliente:</span>
                  <span>{selectedSale.clientName}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Operador:</span>
                  <span>{selectedSale.sellerName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={() => setSelectedSale(null)}
                className="flex-1 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-hover text-white text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-md shadow-app-glow"
              >
                <span>Fechar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
