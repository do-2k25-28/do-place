export const BACKEND_URL = new URL(import.meta.env.VITE_BACKEND_URL);

type RequestOptions<Binary extends boolean = false> = {
  endpoint: string;
  method: string;
  credentials?: boolean;
  body?: object;
  binary?: Binary;
};

type ResponseBody =
  | {
      success: false;
      error: string;
    }
  | { success: true };

export async function request<T, Binary extends boolean = false>(
  options: RequestOptions<Binary>,
): Promise<Binary extends true ? ArrayBuffer : ResponseBody & T> {
  let requestBody: BodyInit | null = null;
  const headers: HeadersInit = {};

  if (options.body) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(options.body);
  }

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
}
