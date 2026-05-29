import { authService } from '../auth';
import { useAppStore } from '../../store';

jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      signInWithOAuth: jest.fn(),
      signInWithOtp: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
  },
}));

beforeEach(() => {
  useAppStore.setState({ user: null, isAuthenticated: false });
  jest.clearAllMocks();
});

describe('authService.signIn', () => {
  it('creates mock user when supabase not configured', async () => {
    const result = await authService.signIn('test@test.com', 'pass');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@test.com');
    expect(result.user.name).toBe('Juan Pérez');
  });

  it('persists user in store', async () => {
    await authService.signIn('test@test.com', 'pass');
    const user = useAppStore.getState().user;
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@test.com');
  });
});

describe('authService.signUp', () => {
  it('creates mock user on sign up', async () => {
    const result = await authService.signUp('new@test.com', 'pass', 'Nuevo Usuario');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('new@test.com');
    expect(result.user.name).toBe('Nuevo Usuario');
  });

  it('persists user in store', async () => {
    await authService.signUp('new@test.com', 'pass', 'Nuevo Usuario');
    expect(useAppStore.getState().user?.name).toBe('Nuevo Usuario');
  });
});

describe('authService.signOut', () => {
  it('logs out by clearing user', async () => {
    useAppStore.getState().setUser({ id: '1', email: 'a@b.com', name: 'Test' } as any);
    await authService.signOut();
    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });
});

describe('authService.signInWithGoogle', () => {
  it('creates mock google user', async () => {
    const result = await authService.signInWithGoogle();
    expect(result.url).toBe('demo');
    const user = useAppStore.getState().user;
    expect(user?.email).toBe('demo.google@gmail.com');
    expect(user?.name).toBe('Usuario Google');
  });
});

describe('authService.signInWithWhatsApp', () => {
  it('creates mock whatsapp user', async () => {
    await authService.signInWithWhatsApp('+541123456789');
    const user = useAppStore.getState().user;
    expect(user?.email).toBe('wa_+541123456789@whatsapp.local');
    expect(user?.name).toBe('Usuario WhatsApp');
  });
});

describe('authService.getSession', () => {
  it('returns null when no stored user', async () => {
    const session = await authService.getSession();
    expect(session).toBeNull();
  });

  it('returns user when stored', async () => {
    await authService.signIn('test@test.com', 'pass');
    const session = await authService.getSession();
    expect(session?.user.email).toBe('test@test.com');
  });
});

describe('authService.restoreSession', () => {
  it('returns true when user is stored', async () => {
    await authService.signIn('a@b.com', 'pass');
    const restored = await authService.restoreSession();
    expect(restored).toBe(true);
  });

  it('returns false when no user stored', async () => {
    const restored = await authService.restoreSession();
    expect(restored).toBe(false);
  });
});
