export type UserRole = 'admin' | 'technician' | 'viewer';
export type TicketStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type PaymentPlan = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo_url?: string;
  role: UserRole;
  plan: PaymentPlan;
  company_name?: string;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  equipment?: Equipment[];
  ticket_count?: number;
}

export interface Ticket {
  id: string;
  user_id: string;
  client_id: string;
  client_name?: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to?: string;
  images?: string[];
  videos?: string[];
  comments?: TicketComment[];
  scheduled_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export interface Equipment {
  id: string;
  client_id: string;
  name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  installation_date?: string;
  warranty_end?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  min_stock: number;
  unit: string;
  price?: number;
  qr_code?: string;
  category?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  client_id: string;
  number: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  pdf_url?: string;
  signature?: string;
  created_at: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Visit {
  id: string;
  client_id: string;
  user_id: string;
  lat: number;
  lng: number;
  address: string;
  check_in: string;
  check_out?: string;
  notes?: string;
}

export interface DashboardStats {
  open_tickets: number;
  today_jobs: number;
  monthly_earnings: number;
  recent_clients: number;
  completion_rate: number;
  avg_response_time: number;
}

export interface Report {
  id: string;
  user_id: string;
  type: 'earnings' | 'tickets' | 'clients' | 'performance';
  data: any;
  date_from: string;
  date_to: string;
  created_at: string;
}
