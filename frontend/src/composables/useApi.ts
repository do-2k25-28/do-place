import { useAccountStore, useCanvasStore } from '@/composables/store';
import { BACKEND_URL, request } from '@/utils';

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

  const login = async (email: string, password: string): Promise<void> => {
    await request({
      endpoint: '/accounts/login',
      method: 'POST',
      body: { email, password },
      credentials: true,
    });
  };

  const accountState = async (): Promise<void> => {
    const store = useAccountStore();

    const response = await request<AccountState, false>({
      endpoint: '/accounts/state',
      method: 'GET',
      credentials: true,
    });

    store.connected = response.connected;

    // It's a bit faster not to use the store for the check
    if (response.connected) {
      store.id = response.userId;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<void> => {
    await request({
      endpoint: '/accounts/register',
      method: 'POST',
      body: { email, username, password },
      credentials: true,
    });
  };

  const getCanvas = async () => {
    const a = await request({
      endpoint: '/canvas',
      method: 'GET',
      binary: true,
    });

    return a;
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

  return { login, accountState, register, getCanvas, getCanvasProperties, getCanvasGateway };
}
