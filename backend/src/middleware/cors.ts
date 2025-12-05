import { Status } from '@oak/commons/status';
import { Middleware } from '@oak/oak';
import { fromEnvWithDefault } from '../utils/fromEnvWithDefault.ts';

interface CorsOptions {
  origin?: string;
  allowCredentials?: boolean;
  allowHeaders?: string[];
  allowMethods?: string[];
}

const origin = fromEnvWithDefault(
  'FRONTEND_ORIGIN',
  '*',
  'Frontend origin not provided. Using default value. Please populate the FRONTEND_ORIGIN environment variable for production deployments.'
);

export default function (options: CorsOptions = {}): Middleware {
  return async (ctx, next) => {
    if (typeof options.origin === 'string')
      ctx.response.headers.set('Access-Control-Allow-Origin', origin);

    if (options.allowCredentials === true)
      ctx.response.headers.set('Access-Control-Allow-Credentials', 'true');

    if (Array.isArray(options.allowHeaders) && options.allowHeaders.length > 0)
      ctx.response.headers.set(
        'Access-Control-Allow-Headers',
        options.allowHeaders.join(', ')
      );

    if (ctx.request.method === 'OPTIONS') {
      ctx.response.status = Status.NoContent;
    } else await next();
  };
}
