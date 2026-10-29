import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Client, Sale, SaleItem, PaymentMethod } from '../types';
import { useAuth } from './AuthContext';

interface RetailDataContextType {
  products: Product[];
  clients: Client[];
  sales: Sale[];
  isLoading: boolean;

  // Product Actions
  addProduct: (data: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (id: string, delta: number) => Promise<void>;

  // Client Actions
  addClient: (data: Omit<Client, 'id' | 'tenantId' | 'createdAt'>) => Promise<Client>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  recordClientPayment: (clientId: string, amount: number) => Promise<void>;

  // PDV / Sales Actions
  createSale: (data: {
    clientId?: string;
    clientName: string;
    items: SaleItem[];
    discount: number;
    paymentMethod: PaymentMethod;
    amountPaid?: number;
  }) => Promise<{ success: boolean; sale?: Sale; error?: string }>;

  // Dashboard Aggregates
  metrics: {
    todaySalesCount: number;
    todayRevenue: number;
    monthRevenue: number;
    lowStockCount: number;
    totalReceivables: number;
    totalStockCost: number;
    totalStockRetail: number;
  };
}

const RetailDataContext = createContext<RetailDataContextType | undefined>(undefined);

// Initial starter clothing / retail products
const INITIAL_DEMO_PRODUCTS = (tenantId: string): Product[] => [
  {
    id: `prod-${tenantId}-1`,
    tenantId,
    name: 'Vestido Midi Canelado Elegance',
    sku: 'VEST-001',
    barcode: '7891000100011',
    category: 'Vestuário',
    size: 'M',
    color: 'Preto',
    costPrice: 45.0,
    salePrice: 119.9,
    currentStock: 18,
    minStock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `prod-${tenantId}-2`,
    tenantId,
    name: 'Camisa Linho Masculina Slim',
    sku: 'CAM-002',
    barcode: '7891000100028',
    category: 'Vestuário',
    size: 'G',
    color: 'Branco',
    costPrice: 55.0,
    salePrice: 139.9,
    currentStock: 12,
    minStock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `prod-${tenantId}-3`,
    tenantId,
    name: 'Calça Jeans Skinny Cintura Alta',
    sku: 'CALC-003',
    barcode: '7891000100035',
    category: 'Vestuário',
    size: '38',
    color: 'Azul Escuro',
    costPrice: 65.0,
    salePrice: 159.9,
    currentStock: 8,
    minStock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `prod-${tenantId}-4`,
    tenantId,
    name: 'Tênis Casual Confort Varejo',
    sku: 'CALC-004',
    barcode: '7891000100042',
    category: 'Calçados',
    size: '40',
    color: 'Branco / Caramelo',
    costPrice: 85.0,
    salePrice: 199.9,
    currentStock: 4,
    minStock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `prod-${tenantId}-5`,
    tenantId,
    name: 'Bolsa Tiracolo em Couro Sintético',
    sku: 'ACESS-005',
    barcode: '7891000100059',
    category: 'Acessórios',
    size: 'Único',
    color: 'Nude',
    costPrice: 40.0,
    salePrice: 99.9,
    currentStock: 2,
    minStock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial starter clients
const INITIAL_DEMO_CLIENTS = (tenantId: string): Client[] => [
  {
    id: `cli-${tenantId}-1`,
    tenantId,
    name: 'Mariana Vasconcelos',
    phone: '(71) 99234-5678',
    email: 'mariana.vasconcelos@email.com',
    cpf: '123.456.789-01',
    address: 'Rua das Flores, 142 - Pituba',
    creditLimit: 600.0,
    currentDebt: 120.0,
    notes: 'Cliente vip de moda feminina, compra no crediário',
    createdAt: new Date().toISOString(),
  },
  {
    id: `cli-${tenantId}-2`,
    tenantId,
    name: 'Carlos Eduardo Mendes',
    phone: '(75) 98877-6655',
    email: 'carlos.mendes@email.com',
    cpf: '987.654.321-00',
    address: 'Av. Senhor do Bonfim, 88 - Centro',
    creditLimit: 400.0,
    currentDebt: 0.0,
    notes: 'Paga sempre pontual no PIX',
    createdAt: new Date().toISOString(),
  },
  {
    id: `cli-${tenantId}-3`,
    tenantId,
    name: 'Ana Paula Ribeiro',
    phone: '(71) 98112-3344',
    email: 'ana.ribeiro@email.com',
    cpf: '456.789.123-55',
    address: 'Rua da Bahia, 500 - Ondina',
    creditLimit: 800.0,
    currentDebt: 240.0,
    notes: 'Em débito há 5 dias - envio de lembrete cordial',
    createdAt: new Date().toISOString(),
  },
];

export const RetailDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenant, currentUser } = useAuth();
  const tenantId = currentTenant?.id || 'default-tenant';

  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tenant-isolated data from localStorage
  useEffect(() => {
    if (!currentTenant) return;
    setIsLoading(true);

    const productsKey = `varejou_products_${currentTenant.id}`;
    const clientsKey = `varejou_clients_${currentTenant.id}`;
    const salesKey = `varejou_sales_${currentTenant.id}`;

    // Products
    const savedProducts = localStorage.getItem(productsKey);
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        setProducts(INITIAL_DEMO_PRODUCTS(currentTenant.id));
      }
    } else {
      const initial = INITIAL_DEMO_PRODUCTS(currentTenant.id);
      setProducts(initial);
      localStorage.setItem(productsKey, JSON.stringify(initial));
    }

    // Clients
    const savedClients = localStorage.getItem(clientsKey);
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients));
      } catch {
        setClients(INITIAL_DEMO_CLIENTS(currentTenant.id));
      }
    } else {
      const initial = INITIAL_DEMO_CLIENTS(currentTenant.id);
      setClients(initial);
      localStorage.setItem(clientsKey, JSON.stringify(initial));
    }

    // Sales
    const savedSales = localStorage.getItem(salesKey);
    if (savedSales) {
      try {
        setSales(JSON.parse(savedSales));
      } catch {
        setSales([]);
      }
    } else {
      setSales([]);
    }

    setIsLoading(false);
  }, [currentTenant?.id]);

  // Sync back to localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    if (currentTenant) {
      localStorage.setItem(`varejou_products_${currentTenant.id}`, JSON.stringify(newProducts));
    }
  };

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    if (currentTenant) {
      localStorage.setItem(`varejou_clients_${currentTenant.id}`, JSON.stringify(newClients));
    }
  };

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    if (currentTenant) {
      localStorage.setItem(`varejou_sales_${currentTenant.id}`, JSON.stringify(newSales));
    }
  };

  // Product Actions
  const addProduct = async (data: Omit<Product, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId: currentTenant?.id || 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProducts([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = async (id: string) => {
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
  };

  const adjustStock = async (id: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.currentStock + delta);
        return { ...p, currentStock: newStock, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    saveProducts(updated);
  };

  // Client Actions
  const addClient = async (data: Omit<Client, 'id' | 'tenantId' | 'createdAt'>): Promise<Client> => {
    const newClient: Client = {
      ...data,
      id: `cli-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId: currentTenant?.id || 'default',
      createdAt: new Date().toISOString(),
    };
    saveClients([newClient, ...clients]);
    return newClient;
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c);
    saveClients(updated);
  };

  const deleteClient = async (id: string) => {
    const filtered = clients.filter(c => c.id !== id);
    saveClients(filtered);
  };

  const recordClientPayment = async (clientId: string, amount: number) => {
    const updated = clients.map(c => {
      if (c.id === clientId) {
        const newDebt = Math.max(0, c.currentDebt - amount);
        return { ...c, currentDebt: newDebt };
      }
      return c;
    });
    saveClients(updated);
  };

  // PDV / Sales Actions
  const createSale = async (data: {
    clientId?: string;
    clientName: string;
    items: SaleItem[];
    discount: number;
    paymentMethod: PaymentMethod;
    amountPaid?: number;
  }): Promise<{ success: boolean; sale?: Sale; error?: string }> => {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'O carrinho de vendas está vazio.' };
    }

    const subtotal = data.items.reduce((acc, item) => acc + item.subtotal, 0);
    const total = Math.max(0, subtotal - (data.discount || 0));

    // Calculate change if cash payment
    const change = data.paymentMethod === 'dinheiro' && data.amountPaid && data.amountPaid > total
      ? data.amountPaid - total
      : 0;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      tenantId: currentTenant?.id || 'default',
      code: `VEN-${String(sales.length + 101).padStart(4, '0')}`,
      clientId: data.clientId,
      clientName: data.clientName || 'Consumidor Final',
      sellerName: currentUser?.fullName || 'Vendedor',
      items: data.items,
      subtotal,
      discount: data.discount || 0,
      total,
      paymentMethod: data.paymentMethod,
      amountPaid: data.amountPaid,
      change,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    // 1. Lower product stock automatically
    const updatedProducts = products.map(product => {
      const soldItem = data.items.find(i => i.productId === product.id);
      if (soldItem) {
        return {
          ...product,
          currentStock: Math.max(0, product.currentStock - soldItem.quantity),
          updatedAt: new Date().toISOString(),
        };
      }
      return product;
    });
    saveProducts(updatedProducts);

    // 2. If crediario (a prazo), add to client debt
    if (data.paymentMethod === 'crediario' && data.clientId) {
      const updatedClients = clients.map(client => {
        if (client.id === data.clientId) {
          return {
            ...client,
            currentDebt: client.currentDebt + total,
          };
        }
        return client;
      });
      saveClients(updatedClients);
    }

    // 3. Save sale
    saveSales([newSale, ...sales]);

    return { success: true, sale: newSale };
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.createdAt.startsWith(todayStr) && s.status === 'completed');
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
  const todaySalesCount = todaySales.length;

  const currentMonthStr = todayStr.substring(0, 7);
  const monthSales = sales.filter(s => s.createdAt.startsWith(currentMonthStr) && s.status === 'completed');
  const monthRevenue = monthSales.reduce((acc, s) => acc + s.total, 0);

  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  const totalReceivables = clients.reduce((acc, c) => acc + c.currentDebt, 0);

  const totalStockCost = products.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0);
  const totalStockRetail = products.reduce((acc, p) => acc + (p.salePrice * p.currentStock), 0);

  return (
    <RetailDataContext.Provider value={{
      products,
      clients,
      sales,
      isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addClient,
      updateClient,
      deleteClient,
      recordClientPayment,
      createSale,
      metrics: {
        todaySalesCount,
        todayRevenue,
        monthRevenue,
        lowStockCount,
        totalReceivables,
        totalStockCost,
        totalStockRetail,
      },
    }}>
      {children}
    </RetailDataContext.Provider>
  );
};

export const useRetailData = () => {
  const context = useContext(RetailDataContext);
  if (!context) {
    throw new Error('useRetailData must be used within a RetailDataProvider');
  }
  return context;
};
