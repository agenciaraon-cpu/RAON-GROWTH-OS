import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables, client-side configured storage, or active project defaults
const DEFAULT_URL = 'https://nbcdzlzgdjzkncyiiuik.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY2R6bHpnZGp6a25jeWlpdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTA3MjEsImV4cCI6MjEwODc2NjcyMX0.WLeS7055Dixh7TUe2ReUeczKe4CHNZr3sg3FteVWhKk';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const getStoredUrl = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('raon_supabase_url') || '';
};

const getStoredKey = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('raon_supabase_anon_key') || '';
};

export const getActiveSupabaseConfig = () => {
  const url = (getStoredUrl() || envUrl || DEFAULT_URL).trim();
  const anonKey = (getStoredKey() || envKey || DEFAULT_KEY).trim();
  
  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    !url.includes('seu-projeto')
  );

  return {
    url,
    anonKey,
    isConfigured,
    source: getStoredUrl() ? 'ui' : envUrl ? 'env' : 'default',
  };
};

const initialConfig = getActiveSupabaseConfig();

export const isSupabaseConfigured = initialConfig.isConfigured;

// Instantiate Supabase client
export const supabase: SupabaseClient | null = initialConfig.isConfigured
  ? createClient(initialConfig.url, initialConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Function to dynamically initialize or test a Supabase connection
export const testAndConnectSupabase = async (
  testUrl: string, 
  testKey: string
): Promise<{ success: boolean; latencyMs?: number; error?: string }> => {
  const cleanUrl = testUrl.trim();
  const cleanKey = testKey.trim();

  if (!cleanUrl.startsWith('https://')) {
    return { success: false, error: 'A URL do Supabase deve iniciar com https:// (ex: https://xyz.supabase.co)' };
  }

  if (!cleanKey || cleanKey.length < 20) {
    return { success: false, error: 'A chave pública anon é inválida ou muito curta.' };
  }

  const startTime = performance.now();

  try {
    const testClient = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false },
    });

    // Check auth session endpoint response
    const { error } = await testClient.auth.getSession();
    const latencyMs = Math.round(performance.now() - startTime);

    if (error && error.status && error.status >= 500) {
      return { success: false, error: `Erro no servidor Supabase: ${error.message}` };
    }

    // Save to local configuration
    localStorage.setItem('raon_supabase_url', cleanUrl);
    localStorage.setItem('raon_supabase_anon_key', cleanKey);

    return { success: true, latencyMs };
  } catch (err: any) {
    return { success: false, error: err.message || 'Falha ao conectar ao endpoint do Supabase.' };
  }
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('raon_supabase_url');
  localStorage.removeItem('raon_supabase_anon_key');
};
