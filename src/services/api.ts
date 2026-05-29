import { supabase } from './supabase';
import { cache } from './cache';
import {
  Client,
  Ticket,
  Equipment,
  InventoryItem,
  Quote,
  Visit,
  DashboardStats,
  User,
} from '../types';

const MOCK_DATA = {
  clients: [
    { id: '1', user_id: '1', name: 'Edificio Torres', phone: '+54 11 4555-1234', address: 'Av. Corrientes 1234', notes: 'Cliente corporativo', lat: -34.6037, lng: -58.3816, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', user_id: '1', name: 'Tech Solutions SA', phone: '+54 11 4777-5678', address: 'Calle Florida 567', notes: 'Contrato mensual', lat: -34.5937, lng: -58.3716, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', user_id: '1', name: 'Oficinas Norte', phone: '+54 11 4888-9012', address: 'Av. Cabildo 3421', notes: '', lat: -34.6137, lng: -58.3916, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', user_id: '1', name: 'Casa Rodríguez', phone: '+54 11 4444-3333', address: 'Lavalle 789', notes: 'Cliente particular', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  tickets: [
    { id: '1', user_id: '1', client_id: '1', client_name: 'Edificio Torres', title: 'Instalación de cámara Dahua', description: 'Instalar 4 cámaras de seguridad', status: 'pending' as const, priority: 'high' as const, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
    { id: '2', user_id: '1', client_id: '2', client_name: 'Tech Solutions SA', title: 'Mantenimiento servidores', description: 'Revisión trimestral', status: 'in_progress' as const, priority: 'urgent' as const, created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(), scheduled_date: new Date(Date.now() + 3600000).toISOString() },
    { id: '3', user_id: '1', client_id: '3', client_name: 'Oficinas Norte', title: 'Reparación red WiFi', description: 'Cobertura insuficiente en piso 3', status: 'completed' as const, priority: 'medium' as const, created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString() },
  ],
  inventory: [
    { id: '1', user_id: '1', name: 'Cable UTP CAT6', quantity: 50, min_stock: 10, unit: 'metros', price: 250, category: 'cables', created_at: new Date().toISOString() },
    { id: '2', user_id: '1', name: 'Conector RJ45', quantity: 100, min_stock: 20, unit: 'unidad', price: 50, category: 'conectores', created_at: new Date().toISOString() },
    { id: '3', user_id: '1', name: 'Cámara Dahua 2MP', quantity: 3, min_stock: 5, unit: 'unidad', price: 15000, category: 'cámaras', created_at: new Date().toISOString() },
    { id: '4', user_id: '1', name: 'Fuente PoE 48V', quantity: 2, min_stock: 3, unit: 'unidad', price: 8000, category: 'accesorios', created_at: new Date().toISOString() },
  ],
};

function isSupabaseConfigured(): boolean {
  return process.env.EXPO_PUBLIC_SUPABASE_ENABLED === 'true';
}

async function tryWithSupabase<T>(supabaseCall: () => Promise<T>, mockData: T, cacheKey?: string): Promise<T> {
  if (!isSupabaseConfigured()) {
    if (cacheKey) await cache.set(cacheKey, mockData);
    return mockData;
  }
  try {
    const result = await supabaseCall();
    if (cacheKey) await cache.set(cacheKey, result);
    return result;
  } catch {
    if (cacheKey) {
      const cached = await cache.get<T>(cacheKey);
      if (cached) return cached;
    }
    return mockData;
  }
}

export const api = {
  async getClients(): Promise<Client[]> {
    return tryWithSupabase(
      async () => {
        const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      },
      MOCK_DATA.clients as any,
      'clients'
    );
  },

  async createClient(client: Partial<Client>): Promise<Client> {
    if (!isSupabaseConfigured()) { await cache.remove('clients'); return { ...client, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Client; }
    const { data, error } = await supabase.from('clients').insert(client).select().single();
    if (error) throw error;
    await cache.remove('clients');
    return data;
  },

  async updateClient(id: string, updates: Partial<Client>) {
    if (!isSupabaseConfigured()) { await cache.remove('clients'); return; }
    const { error } = await supabase.from('clients').update(updates).eq('id', id);
    if (error) throw error;
    await cache.remove('clients');
  },

  async deleteClient(id: string) {
    if (!isSupabaseConfigured()) { await cache.remove('clients'); return; }
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    await cache.remove('clients');
  },

  async getTickets(): Promise<Ticket[]> {
    return tryWithSupabase(
      async () => {
        const { data, error } = await supabase.from('tickets').select('*, clients(name)').order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map((t: any) => ({ ...t, client_name: t.clients?.name }));
      },
      MOCK_DATA.tickets as any,
      'tickets'
    );
  },

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    if (!isSupabaseConfigured()) { await cache.remove('tickets'); return { ...ticket, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Ticket; }
    const { data, error } = await supabase.from('tickets').insert(ticket).select().single();
    if (error) throw error;
    await cache.remove('tickets');
    return data;
  },

  async updateTicket(id: string, updates: Partial<Ticket>) {
    if (!isSupabaseConfigured()) { await cache.remove('tickets'); return; }
    const { error } = await supabase.from('tickets').update(updates).eq('id', id);
    if (error) throw error;
    await cache.remove('tickets');
  },

  async deleteTicket(id: string) {
    if (!isSupabaseConfigured()) { await cache.remove('tickets'); return; }
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (error) throw error;
    await cache.remove('tickets');
  },

  async getInventory(): Promise<InventoryItem[]> {
    return tryWithSupabase(
      async () => {
        const { data, error } = await supabase.from('inventory').select('*').order('name');
        if (error) throw error;
        return data || [];
      },
      MOCK_DATA.inventory as any,
      'inventory'
    );
  },

  async createInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
    if (!isSupabaseConfigured()) { await cache.remove('inventory'); return { ...item, id: Date.now().toString(), created_at: new Date().toISOString() } as InventoryItem; }
    const { data, error } = await supabase.from('inventory').insert(item).select().single();
    if (error) throw error;
    await cache.remove('inventory');
    return data;
  },

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    if (!isSupabaseConfigured()) { await cache.remove('inventory'); return; }
    const { error } = await supabase.from('inventory').update(updates).eq('id', id);
    if (error) throw error;
    await cache.remove('inventory');
  },

  async deleteInventoryItem(id: string) {
    if (!isSupabaseConfigured()) { await cache.remove('inventory'); return; }
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
    await cache.remove('inventory');
  },

  async getQuotes(): Promise<Quote[]> {
    return tryWithSupabase(
      async () => {
        const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      },
      [] as any,
      'quotes'
    );
  },

  async createQuote(quote: Partial<Quote>): Promise<Quote> {
    if (!isSupabaseConfigured()) { await cache.remove('quotes'); return { ...quote, id: Date.now().toString(), created_at: new Date().toISOString() } as Quote; }
    const { data, error } = await supabase.from('quotes').insert(quote).select().single();
    if (error) throw error;
    await cache.remove('quotes');
    return data;
  },

  async updateQuote(id: string, updates: Partial<Quote>) {
    if (!isSupabaseConfigured()) { await cache.remove('quotes'); return; }
    const { error } = await supabase.from('quotes').update(updates).eq('id', id);
    if (error) throw error;
    await cache.remove('quotes');
  },

  async deleteQuote(id: string) {
    if (!isSupabaseConfigured()) { await cache.remove('quotes'); return; }
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (error) throw error;
    await cache.remove('quotes');
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return tryWithSupabase(
      async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        const today = new Date().toISOString().split('T')[0];
        const [openTickets, todayTickets, clientsCount] = await Promise.all([
          supabase.from('tickets').select('id', { count: 'exact' }).eq('user_id', userId).in('status', ['pending', 'in_progress']),
          supabase.from('tickets').select('id', { count: 'exact' }).eq('user_id', userId).gte('created_at', today),
          supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', userId),
        ]);
        return {
          open_tickets: openTickets.count || 0,
          today_jobs: todayTickets.count || 0,
          monthly_earnings: 0,
          recent_clients: clientsCount.count || 0,
          completion_rate: 75,
          avg_response_time: 45,
        };
      },
      { open_tickets: 3, today_jobs: 5, monthly_earnings: 245000, recent_clients: 12, completion_rate: 75, avg_response_time: 45 }
    );
  },

  async getProfile(): Promise<User | null> {
    return tryWithSupabase(
      async () => {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (error) throw error;
        return data;
      },
      null
    );
  },

  async updateProfile(updates: Partial<User>) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) throw error;
  },

  async checkIn(visit: Partial<Visit>): Promise<Visit> {
    if (!isSupabaseConfigured()) return { ...visit, id: Date.now().toString(), check_in: new Date().toISOString() } as Visit;
    const { data, error } = await supabase.from('visits').insert(visit).select().single();
    if (error) throw error;
    return data;
  },

  async checkOut(id: string, notes?: string) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('visits').update({ check_out: new Date().toISOString(), notes }).eq('id', id);
    if (error) throw error;
  },

  async getVisits(): Promise<Visit[]> {
    return tryWithSupabase(
      async () => {
        const { data, error } = await supabase.from('visits').select('*').order('check_in', { ascending: false });
        if (error) throw error;
        return data || [];
      },
      []
    );
  },

  async getEquipment(clientId: string): Promise<Equipment[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase.from('equipment').select('*').eq('client_id', clientId);
    if (error) throw error;
    return data || [];
  },

  async createEquipment(equipment: Partial<Equipment>): Promise<Equipment> {
    if (!isSupabaseConfigured()) return { ...equipment, id: Date.now().toString() } as Equipment;
    const { data, error } = await supabase.from('equipment').insert(equipment).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEquipment(id: string) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) throw error;
  },

  async uploadFile(bucket: string, path: string, file: any) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return data;
  },

  getFileUrl(bucket: string, path: string) {
    if (!isSupabaseConfigured()) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl;
  },
};
