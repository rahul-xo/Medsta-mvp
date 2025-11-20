import axios from 'axios';
import { supabase } from '@/Services/supabase.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
});

// Attach Supabase access token when available
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${session.access_token}`,
    };
  }
  return config;
});

export default api;
