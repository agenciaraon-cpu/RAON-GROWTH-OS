import React, { useState } from 'react';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, 
  Tag, AlertTriangle, Check, X, ArrowUpRight, 
  Shirt, Sparkles, Image, CheckCircle2, DollarSign
} from 'lucide-react';
import { useRetailData } from '../../context/RetailDataContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

const SAMPLE_CLOTHING_IMAGES = [
  { label: 'Vestido Canelado', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80' },
  { label: 'Camisa Masculina', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80' },
  { label: 'Calça Jeans Skinny', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tênis Casual', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80' },
  { label: 'Bolsa Couro', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80' },
  { label: 'Blusa Feminina', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80' },
];

export const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock } = useRetailData();
  const { currentTenant } = useAuth();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Vestuário');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Preto');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [currentStock, setCurrentStock] = useState('10');
  const [minStock, setMinStock] = useState('3');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const categories = ['todos', 'Vestuário', 'Calçados', 'Acessórios', 'Cosméticos', 'Outros'];

  const openNewProductModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`REF-${Math.floor(1000 + Math.random() * 9000)}`);
    setBarcode(`789${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setCategory('Vestuário');
    setSize('M');
    setColor('Preto');
    setCostPrice('40.00');
    setSalePrice('89.90');
    setCurrentStock('12');
    setMinStock('3');
    setImageUrl(SAMPLE_CLOTHING_IMAGES[0].url);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setBarcode(p.barcode || '');
    setCategory(p.category);
    setSize(p.size || 'M');
    setColor(p.color || '');
    setCostPrice(p.costPrice.toString());
    setSalePrice(p.salePrice.toString());
    setCurrentStock(p.currentStock.toString());
    setMinStock(p.minStock.toString());
    setImageUrl(p.imageUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Informe o nome da roupa ou produto.');
      return;
    }

    const cost = parseFloat(costPrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const stock = parseInt(currentStock) || 0;
    const min = parseInt(minStock) || 0;

    if (sale <= 0) {
      setFormError('O preço de venda deve ser maior que zero.');
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        category,
        size,
        color,
        costPrice: cost,
        salePrice: sale,
        currentStock: stock,
        minStock: min,
        imageUrl: imageUrl.trim() || undefined,
      });
    } else {
      await addProduct({
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        category,
        size,
        color,
        costPrice: cost,
        salePrice: sale,
        currentStock: stock,
        minStock: min,
        imageUrl: imageUrl.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));
    const matchesCategory = categoryFilter === 'todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate profit margin
  const costNum = parseFloat(costPrice) || 0;
  const saleNum = parseFloat(salePrice) || 0;
  const profitMargin = saleNum > 0 && costNum > 0 
    ? Math.round(((saleNum - costNum) / saleNum) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0B1225] via-[#15234A] to-[#0B1225] text-white border border-app-primary/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-app-primary bg-app-light px-2.5 py-0.5 rounded-full border border-app-primary/30">
              CATÁLOGO DE PRODUTOS & ROUPAS
            </span>
            <span className="text-xs text-slate-400">
              Loja: {currentTenant?.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
            Cadastro de Roupas & Produtos
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Cadastre itens com grade de tamanho (P, M, G, calçados), cor, preços de custo/venda e foto para vender no caixa.
          </p>
        </div>

        <button
          onClick={openNewProductModal}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-app-glow shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Roupa / Produto</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar por nome, referência SKU ou código de barras..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition capitalize cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-app-primary text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item / Foto</th>
                <th className="py-3 px-4">Referência / EAN</th>
                <th className="py-3 px-4">Categoria / Grade</th>
                <th className="py-3 px-4">Preço Custo</th>
                <th className="py-3 px-4">Preço Venda</th>
                <th className="py-3 px-4">Estoque</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredProducts.map(p => {
                const isLow = p.currentStock <= p.minStock;
                const margin = p.salePrice > 0 ? Math.round(((p.salePrice - p.costPrice) / p.salePrice) * 100) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Shirt className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {p.color ? `Cor: ${p.color}` : ''} {p.size ? `• Tam: ${p.size}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-slate-800 dark:text-slate-200 font-bold block">{p.sku}</span>
                      <span className="text-[10px] text-slate-400">{p.barcode || 'Sem código de barras'}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      R$ {p.costPrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white font-mono block">
                        R$ {p.salePrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold">
                        +{margin}% margem
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold font-mono text-sm ${
                          p.currentStock === 0 ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {p.currentStock} un
                        </span>

                        {isLow && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Baixo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          title="Diminuir 1 estoque"
                          className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-[10px] font-bold"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, 1)}
                          title="Aumentar 1 estoque"
                          className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-[10px] font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Editar Produto"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Deseja realmente excluir "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Package className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs">Nenhum produto cadastrado nesta categoria ainda.</p>
            <button
              onClick={openNewProductModal}
              className="text-xs font-bold text-app-primary hover:underline"
            >
              + Cadastrar primeiro produto agora
            </button>
          </div>
        )}
      </div>

      {/* Modal: New / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-app-light text-app-primary flex items-center justify-center">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingProduct ? 'Editar Roupa / Produto' : 'Cadastrar Roupa / Produto'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Preencha os dados comerciais para inclusão no estoque e caixa.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome da Roupa / Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Vestido Midi Canelado Floral ou Camisa Polo Slim"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold outline-hidden focus:border-app-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
                  >
                    <option value="Vestuário">Vestuário / Roupas</option>
                    <option value="Calçados">Calçados</option>
                    <option value="Acessórios">Acessórios & Bolsas</option>
                    <option value="Cosméticos">Cosméticos & Beleza</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tamanho / Grade
                  </label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
                  >
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XG">XG</option>
                    <option value="36">36</option>
                    <option value="38">38</option>
                    <option value="40">40</option>
                    <option value="42">42</option>
                    <option value="44">44</option>
                    <option value="Único">Tamanho Único</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Cor
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Preto, Azul, Off-White"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:border-app-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Código SKU / Referência Interna
                  </label>
                  <input
                    type="text"
                    placeholder="REF-1001"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Código de Barras (EAN-13)
                  </label>
                  <input
                    type="text"
                    placeholder="789..."
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Preços e Margem */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preço de Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={costPrice}
                    onChange={e => setCostPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-app-primary"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 block">Margem de Lucro:</span>
                  <span className="text-sm font-extrabold text-emerald-500 font-mono">
                    {profitMargin}%
                  </span>
                </div>
              </div>

              {/* Estoque */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Estoque Inicial (Unidades)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={e => setCurrentStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Estoque Mínimo (Alerta de reposição)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minStock}
                    onChange={e => setMinStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Foto / Imagem */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Foto do Produto (URL ou escolher sugestão rápida):
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-700 text-xs mb-2"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_CLOTHING_IMAGES.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(sample.url)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] shrink-0 transition cursor-pointer ${
                        imageUrl === sample.url
                          ? 'border-app-primary bg-app-light text-app-primary font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E172E] text-slate-500'
                      }`}
                    >
                      <img src={sample.url} alt={sample.label} className="w-4 h-4 rounded object-cover" />
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-app-gradient hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-app-glow cursor-pointer"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
