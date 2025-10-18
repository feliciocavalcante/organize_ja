import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as chaves estiverem faltando, o createClient vai falhar internamente e a aplicação 
// deve travar no login, mas não deve causar erro de componente.
// Vamos assumir que as chaves estão corretas (depois de tantos testes!) e exportar diretamente.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);