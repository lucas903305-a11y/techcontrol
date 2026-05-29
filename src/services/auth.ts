import { supabase } from './supabase';
import { useAppStore } from '../store';
import { User } from '../types';

function isSupabaseConfigured(): boolean {
  return process.env.EXPO_PUBLIC_SUPABASE_ENABLED === 'true';
}

function mockUser(email: string, name: string): User {
  return {
    id: 'demo-' + Date.now(),
    email,
    name,
    phone: '+54 11 2345-6789',
    role: 'technician',
    plan: 'pro',
    company_name: 'Tech Solutions',
    created_at: new Date().toISOString(),
  };
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<{ user: any }> {
    if (!isSupabaseConfigured()) {
      const user = mockUser(email, name);
      useAppStore.getState().setUser(user);
      return { user };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || name,
        role: 'technician',
        plan: 'free',
        created_at: data.user.created_at,
      };
      useAppStore.getState().setUser(user);
    }
    return data;
  },

  async signIn(email: string, password: string): Promise<{ user: any }> {
    if (!isSupabaseConfigured()) {
      const user = mockUser(email, 'Juan Pérez');
      useAppStore.getState().setUser(user);
      return { user };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        role: 'technician',
        plan: 'free',
        created_at: data.user.created_at,
      };
      useAppStore.getState().setUser(user);
    }
    return data;
  },

  async signOut() {
    useAppStore.getState().logout();
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      const user = mockUser('demo.google@gmail.com', 'Usuario Google');
      useAppStore.getState().setUser(user);
      return { url: 'demo' };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
    return data;
  },

  async signInWithWhatsApp(phone: string) {
    if (!isSupabaseConfigured()) {
      const user = mockUser(`wa_${phone}@whatsapp.local`, 'Usuario WhatsApp');
      useAppStore.getState().setUser(user);
      return;
    }
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return data;
  },

  async getSession() {
    if (!isSupabaseConfigured()) {
      const stored = useAppStore.getState().user;
      return stored ? { user: stored } as any : null;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async restoreSession(): Promise<boolean> {
    const session = await this.getSession();
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
        role: 'technician',
        plan: 'free',
        created_at: session.user.created_at,
      };
      useAppStore.getState().setUser(user);
      return true;
    }
    const storedUser = useAppStore.getState().user;
    return !!storedUser;
  },

  onAuthChange(callback: (session: any) => void) {
    if (!isSupabaseConfigured()) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange((_event, session) => callback(session));
  },
};
