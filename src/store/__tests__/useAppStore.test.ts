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

describe('useAppStore', () => {
  it('starts with default state', () => {
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isDarkMode).toBe(false);
  });

  it('sets user', () => {
    const user = { id: '1', name: 'Test', email: 'test@test.com', role: 'technician', plan: 'pro', created_at: new Date().toISOString() };
    useAppStore.getState().setUser(user as any);
    expect(useAppStore.getState().user).toEqual(user);
    expect(useAppStore.getState().isAuthenticated).toBe(true);
  });

  it('toggles dark mode', () => {
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(true);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(false);
  });

  it('shows and hides toast', () => {
    useAppStore.getState().showToast('Hello', 'success');
    const toast = useAppStore.getState().toast;
    expect(toast.visible).toBe(true);
    expect(toast.message).toBe('Hello');
    expect(toast.type).toBe('success');

    useAppStore.getState().hideToast();
    expect(useAppStore.getState().toast.visible).toBe(false);
  });

  it('clears user on logout', () => {
    useAppStore.getState().setUser({ id: '1', name: 'Test' } as any);
    useAppStore.getState().logout();
    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });
});
