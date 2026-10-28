import React from 'react';
import { 
  Sparkles, Clock, CheckCircle2, ShoppingCart, 
  Package, Boxes, CreditCard, DollarSign, ArrowRight, Store
} from 'lucide-react';
import { AppNavigationRoute } from '../../types';

interface UnderConstructionViewProps {
  route: AppNavigationRoute;
  onNavigateOverview: () => void;
}

const MODULE_DETAILS: Record<string, { title: string; subtitle: string; icon: React.ElementType; features: string[] }> = {
  pos: {
    title: 'Frente de Caixa / PDV',
    subtitle: 'Módulo de vendas rápidas com leitor de código de barras, múltiplos meios de pagamento e impressão térmica.',
    icon: ShoppingCart,
    features: ['Abertura e fechamento de caixa', 'Venda rápida por código de barras', 'Pagamentos em PIX, Cartão, Dinheiro e Crediário', 'Emissão de cupom não fiscal e NFC-e'],
  },
  sales: {
    title: 'Gestão de Vendas',
    subtitle: 'Histórico completo de pedidos, devoluções, trocas e comissões de vendedores.',
    icon: ShoppingCart,
    features: ['Consulta de vendas por período', 'Gestão de trocas e estornos', 'Cálculo de comissão de vendedores', 'Filtros avançados por cliente e filial'],
  },
  products: {
    title: 'Catálogo de Produtos',
    subtitle: 'Cadastro de itens com grade de cor e tamanho, código EAN/código de barras, categorias e fotos.',
    icon: Package,
    features: ['Grade de tamanhos (P, M, G, GG, 36 a 44)', 'Preço de custo, margem e preço de venda', 'Etiquetas com código de barras', 'Controle por marca e fornecedor'],
  },
  stock: {
    title: 'Controle de Estoque',
    subtitle: 'Entrada por nota fiscal, alerta de estoque mínimo, movimentações e transferências.',
    icon: Boxes,
    features: ['Alerta de estoque baixo', 'Histórico de entradas e saídas', 'Importação de XML de NF-e', 'Curva ABC de produtos mais vendidos'],
  },
  credit: {
    title: 'Vendas a Prazo / Crediário da Loja',
    subtitle: 'Gestão de fiado, carnês da loja, limites de crédito por cliente e lembretes de cobrança.',
    icon: CreditCard,
    features: ['Emissão de carnê de pagamento', 'Controle de juros e multas', 'Análise de limite de crédito', 'Histórico de adimplência do cliente'],
  },
  receivables: {
    title: 'Contas a Receber',
    subtitle: 'Fluxo de recebimentos de cartão, boletos e crediário com previsão de liquidação.',
    icon: DollarSign,
    features: ['Calendário de recebimentos', 'Taxas de antecipação de maquininha', 'Baixa manual e automática', 'Relatório de inadimplência'],
  },
};

export const UnderConstructionView: React.FC<UnderConstructionViewProps> = ({
  route,
  onNavigateOverview,
}) => {
  const info = MODULE_DETAILS[route] || {
    title: 'Módulo em Desenvolvimento (Etapa 2)',
    subtitle: 'Esta funcionalidade faz parte do roadmap oficial e será implementada na próxima etapa.',
    icon: Clock,
    features: ['Estrutura de dados já preparada nas migrations', 'Integração direta com o banco PostgreSQL', 'Componentes reutilizáveis e validados'],
  };

  const Icon = info.icon;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0E172E] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#345CF3]/10 text-[#345CF3] flex items-center justify-center mx-auto shadow-sm">
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Módulo Planejado para a Etapa 2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {info.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {info.subtitle}
          </p>
        </div>

        {/* Features preview */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left max-w-md mx-auto space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            O que estará incluso neste módulo:
          </span>
          {info.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#17B897] shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={onNavigateOverview}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Voltar para Visão Geral
          </button>
        </div>
      </div>
    </div>
  );
};
