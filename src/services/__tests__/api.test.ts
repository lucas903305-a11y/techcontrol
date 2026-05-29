import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';

jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getUser: jest.fn() },
    storage: { from: jest.fn() },
  },
}));

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('api.getClients', () => {
  it('returns mock clients', async () => {
    const clients = await api.getClients();
    expect(clients.length).toBeGreaterThanOrEqual(4);
    expect(clients[0].name).toBeDefined();
    expect(clients[0].phone).toBeDefined();
  });
});

describe('api.createClient', () => {
  it('creates a client with mock data', async () => {
    const client = await api.createClient({ name: 'Test', phone: '123' });
    expect(client.id).toBeDefined();
    expect(client.name).toBe('Test');
    expect(client.created_at).toBeDefined();
  });
});

describe('api.updateClient', () => {
  it('updates a client', async () => {
    await expect(api.updateClient('1', { name: 'Updated' })).resolves.toBeUndefined();
  });
});

describe('api.deleteClient', () => {
  it('deletes a client', async () => {
    await expect(api.deleteClient('1')).resolves.toBeUndefined();
  });
});

describe('api.getTickets', () => {
  it('returns mock tickets', async () => {
    const tickets = await api.getTickets();
    expect(tickets.length).toBeGreaterThanOrEqual(3);
    expect(tickets[0].title).toBeDefined();
  });
});

describe('api.createTicket', () => {
  it('creates a ticket with mock data', async () => {
    const ticket = await api.createTicket({ title: 'New Ticket', description: 'Test' });
    expect(ticket.id).toBeDefined();
    expect(ticket.title).toBe('New Ticket');
    expect(ticket.created_at).toBeDefined();
  });
});

describe('api.updateTicket', () => {
  it('updates a ticket', async () => {
    await expect(api.updateTicket('1', { status: 'completed' })).resolves.toBeUndefined();
  });
});

describe('api.deleteTicket', () => {
  it('deletes a ticket', async () => {
    await expect(api.deleteTicket('1')).resolves.toBeUndefined();
  });
});

describe('api.getInventory', () => {
  it('returns mock inventory', async () => {
    const items = await api.getInventory();
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(items[0].name).toBeDefined();
  });
});

describe('api.createInventoryItem', () => {
  it('creates an inventory item', async () => {
    const item = await api.createInventoryItem({ name: 'Router', quantity: 5 });
    expect(item.id).toBeDefined();
    expect(item.name).toBe('Router');
  });
});

describe('api.updateInventoryItem', () => {
  it('updates an inventory item', async () => {
    await expect(api.updateInventoryItem('1', { quantity: 10 })).resolves.toBeUndefined();
  });
});

describe('api.deleteInventoryItem', () => {
  it('deletes an inventory item', async () => {
    await expect(api.deleteInventoryItem('1')).resolves.toBeUndefined();
  });
});

describe('api.getDashboardStats', () => {
  it('returns mock dashboard stats', async () => {
    const stats = await api.getDashboardStats();
    expect(stats.open_tickets).toBe(3);
    expect(stats.today_jobs).toBe(5);
    expect(stats.monthly_earnings).toBe(245000);
  });
});

describe('api.getQuotes', () => {
  it('returns empty quotes array', async () => {
    const quotes = await api.getQuotes();
    expect(quotes).toEqual([]);
  });
});

describe('api.createQuote', () => {
  it('creates a quote with mock data', async () => {
    const quote = await api.createQuote({ client_name: 'Test', total: 1000 });
    expect(quote.id).toBeDefined();
    expect(quote.total).toBe(1000);
  });
});

describe('api.updateQuote', () => {
  it('updates a quote', async () => {
    await expect(api.updateQuote('1', { total: 2000 })).resolves.toBeUndefined();
  });
});

describe('api.deleteQuote', () => {
  it('deletes a quote', async () => {
    await expect(api.deleteQuote('1')).resolves.toBeUndefined();
  });
});

describe('api.checkIn', () => {
  it('returns a visit with check-in time', async () => {
    const visit = await api.checkIn({ client_id: '1' });
    expect(visit.id).toBeDefined();
    expect(visit.check_in).toBeDefined();
  });
});

describe('api.checkOut', () => {
  it('completes check-out', async () => {
    await expect(api.checkOut('1', 'Done')).resolves.toBeUndefined();
  });
});

describe('api.getVisits', () => {
  it('returns empty visits array', async () => {
    const visits = await api.getVisits();
    expect(visits).toEqual([]);
  });
});

describe('api.getEquipment', () => {
  it('returns empty equipment array', async () => {
    const equipment = await api.getEquipment('1');
    expect(equipment).toEqual([]);
  });
});

describe('api.createEquipment', () => {
  it('creates equipment with mock data', async () => {
    const eq = await api.createEquipment({ client_id: '1', name: 'Router' });
    expect(eq.id).toBeDefined();
    expect(eq.name).toBe('Router');
  });
});

describe('api.deleteEquipment', () => {
  it('deletes equipment', async () => {
    await expect(api.deleteEquipment('1')).resolves.toBeUndefined();
  });
});

describe('api.getProfile', () => {
  it('returns null profile in mock mode', async () => {
    const profile = await api.getProfile();
    expect(profile).toBeNull();
  });
});

describe('api.updateProfile', () => {
  it('does nothing in mock mode', async () => {
    await expect(api.updateProfile({ name: 'Test' })).resolves.toBeUndefined();
  });
});

describe('api.uploadFile', () => {
  it('returns null in mock mode', async () => {
    const result = await api.uploadFile('bucket', 'path', {});
    expect(result).toBeNull();
  });
});

describe('api.getFileUrl', () => {
  it('returns null in mock mode', async () => {
    const result = api.getFileUrl('bucket', 'path');
    expect(result).toBeNull();
  });
});
