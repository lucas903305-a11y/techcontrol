import { useAppStore } from '../useAppStore';

beforeEach(() => {
  useAppStore.setState({
    user: null,
    isAuthenticated: false,
    isDarkMode: false,
    isOnboardingDone: false,
    stats: null,
    loading: false,
    toast: { visible: false, message: '', type: 'info' },
  });
});

describe('useAppStore authentication', () => {
  it('setUser marks authenticated when user provided', () => {
    useAppStore.getState().setUser({ id: '1', email: 'a@b.com', name: 'Test' } as any);
    const state = useAppStore.getState();
    expect(state.user?.email).toBe('a@b.com');
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser with null marks unauthenticated', () => {
    useAppStore.getState().setUser(null);
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setAuthenticated sets value directly', () => {
    useAppStore.getState().setAuthenticated(true);
    expect(useAppStore.getState().isAuthenticated).toBe(true);
    useAppStore.getState().setAuthenticated(false);
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });

  it('logout clears user, auth, and stats', () => {
    useAppStore.setState({ user: { id: '1' } as any, isAuthenticated: true, stats: { open_tickets: 3 } as any });
    useAppStore.getState().logout();
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.stats).toBeNull();
  });
});

describe('useAppStore dark mode', () => {
  it('toggleDarkMode flips isDarkMode', () => {
    expect(useAppStore.getState().isDarkMode).toBe(false);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(true);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(false);
  });

  it('setDarkMode sets value directly', () => {
    useAppStore.getState().setDarkMode(true);
    expect(useAppStore.getState().isDarkMode).toBe(true);
    useAppStore.getState().setDarkMode(false);
    expect(useAppStore.getState().isDarkMode).toBe(false);
  });
});

describe('useAppStore utilities', () => {
  it('setOnboardingDone sets value', () => {
    useAppStore.getState().setOnboardingDone(true);
    expect(useAppStore.getState().isOnboardingDone).toBe(true);
  });

  it('setStats stores stats', () => {
    const stats = { open_tickets: 5, today_jobs: 3 } as any;
    useAppStore.getState().setStats(stats);
    expect(useAppStore.getState().stats?.open_tickets).toBe(5);
  });

  it('setLoading sets loading', () => {
    useAppStore.getState().setLoading(true);
    expect(useAppStore.getState().loading).toBe(true);
  });

  it('showToast shows toast message', () => {
    useAppStore.getState().showToast('Hello', 'success');
    const toast = useAppStore.getState().toast;
    expect(toast.visible).toBe(true);
    expect(toast.message).toBe('Hello');
    expect(toast.type).toBe('success');
  });

  it('showToast defaults to info type', () => {
    useAppStore.getState().showToast('Test');
    expect(useAppStore.getState().toast.type).toBe('info');
  });

  it('hideToast hides toast', () => {
    useAppStore.getState().showToast('Visible');
    useAppStore.getState().hideToast();
    const toast = useAppStore.getState().toast;
    expect(toast.visible).toBe(false);
    expect(toast.message).toBe('');
  });
});
