import { useAccountStore, useCanvasStore } from '@/composables/store';
import { BACKEND_URL, request } from '@/utils';

export type Login = {
  userId: string;
};

export type AccountState =
  | {
      connected: false;
    }
  | { connected: true; userId: string };

export type CanvasColor = { name: string; hex: string };

export type CanvasProperties = {
  width: number;
  height: number;
  colors: CanvasColor[];
};

export function useApi() {
  const canvasStore = useCanvasStore();
  const authStore = useAccountStore();

  const login = async (email: string, password: string): Promise<void> => {
    const response = await request<Login>({
      endpoint: '/accounts/login',
      method: 'POST',
      body: { email, password },
      credentials: true,
    });

    if (response.success) {
      authStore.connected = true;
      authStore.id = response.userId;
    }
  };

  const logout = async (): Promise<void> => {
    await request({
      endpoint: '/accounts/logout',
      method: 'POST',
      credentials: true,
    });

    authStore.connected = false;
  };

  const register = async (email: string, username: string, password: string): Promise<void> => {
    await request({
      endpoint: '/accounts/register',
      method: 'POST',
      body: { email, username, password },
      credentials: true,
    });
  };

  const accountState = async (): Promise<void> => {
    const response = await request<AccountState, false>({
      endpoint: '/accounts/state',
      method: 'GET',
      credentials: true,
    });

    authStore.connected = response.connected;

    // It's a bit faster not to use the store for the check
    if (response.connected) {
      authStore.id = response.userId;
    }
  };

  const getCanvas = async () => {
    return await request({
      endpoint: '/canvas',
      method: 'GET',
      binary: true,
    });
  };

  const getCanvasProperties = async () => {
    const response = await request<CanvasProperties>({
      endpoint: '/canvas/properties',
      method: 'GET',
    });

    if (response.success) {
      canvasStore.colors = response.colors;
      canvasStore.width = response.width;
      canvasStore.height = response.height;
    }

    return response;
  };

  const getCanvasGateway = () => {
    return new WebSocket(BACKEND_URL + '/canvas/gateway');
  };

  return {
    login,
    logout,
    accountState,
    register,
    getCanvas,
    getCanvasProperties,
    getCanvasGateway,
  };
}
