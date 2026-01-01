import { Logger } from './logger';

export const BACKEND_URL = new URL(import.meta.env.VITE_BACKEND_URL, globalThis.origin);

type RequestOptions<Binary extends boolean = false> = {
  endpoint: string;
  method: string;
  credentials?: boolean;
  body?: object;
  binary?: Binary;
  /** @deprecated Used for internal calls only, do not use. */
  innerRequest?: boolean;
};

type ResponseBody =
  | {
      success: false;
      error: string;
    }
  | { success: true };

const logger = new Logger('API', '#00ff37');

async function refreshToken(): Promise<void> {
  await fetch(BACKEND_URL + '/accounts/token', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function request<T, Binary extends boolean = false>(
  options: RequestOptions<Binary>,
): Promise<Binary extends true ? ArrayBuffer : ResponseBody & T> {
  let requestBody: BodyInit | null = null;
  const headers: HeadersInit = {};

  if (options.body) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(BACKEND_URL + options.endpoint, {
      method: options.method,
      credentials: options.credentials === true ? 'include' : undefined,
      headers,
      body: requestBody,
    });

    if (options.binary === true) {
      if (response.status !== 200) throw new Error('get canvas failed');

      // @ts-ignore
      return await response.arrayBuffer();
    }

    const body = (await response.json()) as ResponseBody & T;
    if (body.success === false) throw new Error(body.error);

    // @ts-ignore
    return body;
  } catch (error) {
    // If this was called by the request function itself, we
    // don't try again.
    if (options.innerRequest !== true) throw error;
    if (!(error instanceof Error)) throw error;

    if (error.message === 'token_expired') {
      logger.debug('Access token expired, refreshing it...');

      try {
        await refreshToken();
        return await request({ ...options, innerRequest: true });
      } catch (error) {
        logger.debug('Failed to refresh access token. User needs to login again.');
        throw new Error('request_failed');
      }
    } else throw error;
  }
}
