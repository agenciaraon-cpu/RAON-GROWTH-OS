import React, { useState } from 'react';
import { 
  Share2, CheckCircle2, XCircle, Settings, ExternalLink, 
  MessageSquare, DollarSign, BarChart3, Workflow, ShieldCheck,
  RefreshCw, Power
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Integration } from '../../types';

export const IntegrationsModule: React.FC = () => {
  const { integrations, toggleIntegration, updateIntegrationConfig } = useData();
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [editingConfig, setEditingConfig] = useState<Record<string, string>>({});

  const handleOpenConfig = (item: Integration) => {
    setSelectedIntegration(item);
    setEditingConfig({ ...item.config });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIntegration) {
      updateIntegrationConfig(selectedIntegration.id, editingConfig);
      setSelectedIntegration(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
              CONECTORES OFICIAIS & APIS
            </span>
            <span className="text-xs text-[#94A3B8]">MÉTODO RAON 360°</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Central de Integrações & Webhooks
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Conecte Meta Ads, Google Ads, WhatsApp Business API oficial e gateways de pagamento para automação total.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(item => {
          const isConnected = item.status === 'connected';

          return (
            <div 
              key={item.id}
              className="p-5 rounded-2xl bg-[#101522] border border-[#151C2C] hover:border-[#38BDF8]/40 transition shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#151C2C] text-[#94A3B8]">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                    isConnected ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#94A3B8]/20 text-[#94A3B8]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'}`} />
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2">
                  {item.name}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {item.description}
                </p>

                {item.lastSyncAt && (
                  <div className="mt-3 text-[10px] text-[#38BDF8] font-mono flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>Última sincronização: {item.lastSyncAt}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#151C2C] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenConfig(item)}
                  className="px-3 py-1.5 rounded-lg bg-[#080B14] hover:bg-[#151C2C] border border-[#151C2C] text-xs text-[#94A3B8] hover:text-white transition flex items-center gap-1.5 font-medium"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar</span>
                </button>

                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    isConnected
                      ? 'bg-[#EF4444]/15 hover:bg-[#EF4444] text-[#EF4444] hover:text-white'
                      : 'bg-[#22C55E] hover:bg-[#22C55E]/90 text-white'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isConnected ? 'Desconectar' : 'Conectar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Config Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#101522] border border-[#151C2C] rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">
              Configurações de {selectedIntegration.name}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Insira os parâmetros de API oficiais para autenticação no ambiente de produção.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-3">
              {selectedIntegration.provider === 'whatsapp' && (
                <>
                  <div>
                    <label className="block text-[#94A3B8] mb-1 font-medium">Phone Number ID (Meta Graph API)</label>
                    <input
                      type="text"
                      value={editingConfig.phoneId || ''}
                      onChange={e => setEditingConfig({ ...editingConfig, phoneId: e.target.value })}
                      placeholder="109847291823901"
                      className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94A3B8] mb-1 font-medium">WhatsApp Business Account ID (WABA)</label>
                    <input
                      type="text"
                      value={editingConfig.wabaId || ''}
                      onChange={e => setEditingConfig({ ...editingConfig, wabaId: e.target.value })}
                      placeholder="waba_99812739182"
                      className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono"
                    />
                  </div>
                </>
              )}

              {selectedIntegration.provider === 'meta_ads' && (
                <>
                  <div>
                    <label className="block text-[#94A3B8] mb-1 font-medium">Ad Account ID</label>
                    <input
                      type="text"
                      value={editingConfig.accountId || ''}
                      onChange={e => setEditingConfig({ ...editingConfig, accountId: e.target.value })}
                      placeholder="act_48291039481"
                      className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94A3B8] mb-1 font-medium">Pixel ID (Conversions API)</label>
                    <input
                      type="text"
                      value={editingConfig.pixelId || ''}
                      onChange={e => setEditingConfig({ ...editingConfig, pixelId: e.target.value })}
                      placeholder="pix_991827491"
                      className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono"
                    />
                  </div>
                </>
              )}

              {selectedIntegration.provider === 'webhooks' && (
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-medium">Webhook Endpoint URL</label>
                  <input
                    type="text"
                    value={editingConfig.endpoint || ''}
                    onChange={e => setEditingConfig({ ...editingConfig, endpoint: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#151C2C] text-white focus:border-[#38BDF8] outline-hidden font-mono text-[11px]"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-[#151C2C] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIntegration(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#151C2C] text-[#94A3B8] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#38BDF8] text-white font-semibold"
                >
                  Salvar Credenciais
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
