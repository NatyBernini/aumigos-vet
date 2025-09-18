import { describe, expect, it, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePersistentStore } from '../persistentStore';
import { useAppStore } from './app';
import { getUserDataRequest } from '@/modules/commons/services/auth';

vi.mock('@/modules/commons/services/auth', () => ({
  getUserDataRequest: vi.fn().mockResolvedValue({ nome: 'João' }),
  getTokenRequest: vi.fn().mockResolvedValue({ id_token: '123' })
}));

const OAuthSSCSignInMock = vi.fn();
const OAuthSSCSignOutMock = vi.fn();
vi.mock('@/modules/commons/helpers/OAuthSSC', () => ({
  createOAuthSSC: () => ({
    signIn: OAuthSSCSignInMock,
    signOut: OAuthSSCSignOutMock
  })
}));

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should be initialized correctly', () => {
    const appStore = useAppStore();

    expect(appStore.loading).toBe(false);
    expect(appStore.isAuthorized).toBe(false);
    expect(appStore.userData).toBeNull();
  });

  it('should login correctly', async () => {
    const appStore = useAppStore();
    const persistentStore = usePersistentStore();

    persistentStore.jwtToken = '123';
    await appStore.login();
    expect(appStore.isAuthorized).toBe(true);
    expect(appStore.userData?.nome).toBe('João');
  });

  it('should redirect correctly to SSC', async () => {
    const appStore = useAppStore();

    await appStore.login();
    expect(appStore.isAuthorized).toBe(false);
    expect(OAuthSSCSignInMock).toHaveBeenCalled();
  });

  it('should receive the Auth Code and request the JWT Token', async () => {
    const appStore = useAppStore();
    const persistentStore = usePersistentStore();

    expect(persistentStore.jwtToken).toBeNull();

    window.location = { ...window.location, search: '?code=abc123' };
    await appStore.login();
    expect(persistentStore.jwtToken).toBe('123');
    expect(appStore.isAuthorized).toBe(true);
    expect(appStore.userData?.nome).toBe('João');
  });

  it('should logout if there is an error', async () => {
    const appStore = useAppStore();
    const persistentStore = usePersistentStore();

    // @ts-ignore
    getUserDataRequest.mockRejectedValueOnce(new Error('Error'));
    persistentStore.jwtToken = '123';

    await appStore.login();
    expect(appStore.isAuthorized).toBe(false);
    expect(OAuthSSCSignOutMock).toHaveBeenCalled();
  });

  it('should logout correctly', async () => {
    const appStore = useAppStore();
    const persistentStore = usePersistentStore();

    persistentStore.jwtToken = '123';
    await appStore.logout();
    expect(persistentStore.jwtToken).toBeNull();
    expect(appStore.loading).toBe(true);
    expect(appStore.isAuthorized).toBe(false);
    expect(appStore.userData).toBeNull();
    expect(OAuthSSCSignOutMock).toHaveBeenCalled();
  });
});
