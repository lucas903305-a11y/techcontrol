import { supabase } from './supabase';

function isSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  return !!url && url !== '' && !url.includes('your-project');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiCall<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  mockData?: T
): Promise<T> {
  if (!isSupabaseConfigured()) {
    if (mockData !== undefined) return mockData;
    throw new ApiError('Supabase no configurado. Configurá EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en .env');
  }

  try {
    const { data, error } = await operation();
    if (error) throw new ApiError(error.message, error.code, error);
    return (data ?? []) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error) throw new ApiError(error.message);
    throw new ApiError('Error de conexión con el servidor');
  }
}
